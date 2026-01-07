import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusTransaksi, Transaksi } from './entities/transaksi.entity';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { CreateTransaksiWithDetailsDto } from '../detail-transaksi/dto/create-transaksi-with-details.dto';
import { DetailTransaksi } from '../detail-transaksi/entities/detail-transaksi.entity';
import { ProdukService } from 'src/produk/produk.service';
import { Produk } from 'src/produk/entities/produk.entity';
@Injectable()
export class TransaksiService {
  constructor(
    @InjectRepository(Transaksi)
    private readonly transaksiRepository: Repository<Transaksi>,

    @InjectRepository(DetailTransaksi)
    private readonly produkRepository: Repository<Produk>,
    @InjectRepository(DetailTransaksi)
    private readonly detailRepository: Repository<DetailTransaksi>,
    private readonly produkService: ProdukService,
  ) {}
  // dadasadsa
  // Create a new transaction
  async createWithDetails(
    dto: CreateTransaksiWithDetailsDto,
  ): Promise<Transaksi> {
    const currentDate = new Date();
    const nomorTransaksi = `TR-${currentDate.getFullYear()}${(
      '0' +
      (currentDate.getMonth() + 1)
    ).slice(-2)}${('0' + currentDate.getDate()).slice(-2)}-${currentDate
      .getTime()
      .toString()
      .slice(-6)}`;

    return this.transaksiRepository.manager.transaction(async (manager) => {
      try {
        // 🟩 STEP 1: Insert transaksi
        await manager.query(
          `
        INSERT INTO transaksi (
          nomor_transaksi, tanggal, total_harga,
          nama_pembeli, alamat, telp, email, bukti_transfer, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            nomorTransaksi,
            currentDate,
            0,
            dto.nama_pembeli,
            dto.alamat,
            dto.telp,
            dto.email,
            dto.bukti_transfer ?? null,
            'pending',
          ],
        );

        const [{ id: transaksiId }] = await manager.query(
          `SELECT LAST_INSERT_ID() AS id`,
        );

        let totalHarga = 0;

        // 🟩 STEP 3: Insert detail + kurangi stock
        for (const detail of dto.purchase_details) {
          const produk = await manager.findOne(Produk, {
            where: { id: detail.produk_id },
            lock: { mode: 'pessimistic_write' }, // 🔒 penting!
          });

          if (!produk) {
            throw new Error(`Produk ID ${detail.produk_id} tidak ditemukan`);
          }

          if (produk.stock < detail.quantity) {
            throw new Error(`Stock produk "${produk.nama}" tidak mencukupi`);
          }

          const subtotal = detail.quantity * produk.harga;
          totalHarga += subtotal;

          // Insert detail_transaksi
          await manager.query(
            `
          INSERT INTO detail_transaksi
          (quantity, subtotal, transaksi_id, produk_id)
          VALUES (?, ?, ?, ?)
          `,
            [detail.quantity, subtotal, transaksiId, detail.produk_id],
          );

          // 🔥 Kurangi stock produk
          await manager.query(
            `
          UPDATE produk
          SET stock = stock - ?
          WHERE id = ?
          `,
            [detail.quantity, detail.produk_id],
          );
        }

        // 🟩 STEP 4: Update total harga
        await manager.query(
          `
        UPDATE transaksi
        SET total_harga = ?
        WHERE id = ?
        `,
          [totalHarga, transaksiId],
        );

        // 🟩 STEP 5: Return transaksi lengkap
        return manager.findOne(Transaksi, {
          where: { id: transaksiId },
          relations: ['details', 'details.produk'],
        });
      } catch (error) {
        console.error('❌ Error dalam transaksi:', error);
        throw error;
      }
    });
  }

  async findAll(): Promise<Transaksi[]> {
    return this.transaksiRepository.find().then((transaksiList) => {
      return transaksiList;
    });
  }

  async findAllFiltered(filter: {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Transaksi[]> {
    const query = this.transaksiRepository.createQueryBuilder('transaksi');

    if (filter.search) {
      // Ganti ILIKE dengan LOWER + LIKE agar case-insensitive di MySQL
      query.andWhere(
        '(LOWER(transaksi.nama_pembeli) LIKE :search OR LOWER(transaksi.nomor_transaksi) LIKE :search)',
        { search: `%${filter.search.toLowerCase()}%` },
      );
    }

    if (filter.status) {
      query.andWhere('transaksi.status = :status', { status: filter.status });
    }

    if (filter.startDate) {
      query.andWhere('transaksi.tanggal >= :startDate', {
        startDate: filter.startDate,
      });
    }

    if (filter.endDate) {
      query.andWhere('transaksi.tanggal <= :endDate', {
        endDate: filter.endDate,
      });
    }

    query.orderBy('transaksi.tanggal', 'DESC');

    return query.getMany();
  }

  async findOne(id: number): Promise<Transaksi> {
    const transaksi = await this.transaksiRepository.findOne({
      where: { id },
      relations: ['details', 'details.produk'],
    });

    if (!transaksi) {
      throw new NotFoundException(`Transaksi dengan ID ${id} tidak ditemukan`);
    }

    const baseUrl = `${process.env.BASE_URL}/uploads/bukti-transfer/`;

    if (transaksi.bukti_transfer) {
      transaksi.bukti_transfer = baseUrl + transaksi.bukti_transfer;
    }

    transaksi.details.forEach((detail) => {
      console.log('detail', detail);
      if (detail.produk && detail.produk.foto) {
        detail.produk.foto = baseUrl + detail.produk.foto[0];
      }
    });

    return transaksi;
  }

  async update(
    id: number,
    updateTransaksiDto: CreateTransaksiDto,
  ): Promise<Transaksi> {
    await this.transaksiRepository.update(id, updateTransaksiDto);
    return this.transaksiRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.transaksiRepository.delete(id);
  }

  async updateStatus(id: number, status: string): Promise<Transaksi> {
    const allowedStatus = [
      'pending',
      'process',
      'deliver',
      'cancelled',
      'completed',
    ];

    if (!allowedStatus.includes(status)) {
      throw new Error(`Status "${status}" tidak valid`);
    }

    return this.transaksiRepository.manager.transaction(async (manager) => {
      // 🔹 Ambil transaksi + detail + produk
      const transaksi = await manager.findOne(Transaksi, {
        where: { id },
        relations: ['details', 'details.produk'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!transaksi) {
        throw new Error(`Transaksi dengan ID ${id} tidak ditemukan`);
      }

      const prevStatus = transaksi.status;

      // 🔥 BALIKIN STOCK
      if (status === 'cancelled' && prevStatus !== 'cancelled') {
        for (const detail of transaksi.details) {
          await manager.query(
            `
          UPDATE produk
          SET stock = stock + ?
          WHERE id = ?
          `,
            [detail.quantity, detail.produk.id],
          );
        }
      }

      // 🔹 Update status transaksi
      transaksi.status = status as StatusTransaksi;
      await manager.save(transaksi);

      return transaksi;
    });
  }
}
