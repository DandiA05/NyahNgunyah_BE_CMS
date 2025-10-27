// src/cuti/cuti.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuti } from './entities/cuti.entity';
import { CreateCutiDto } from './dto/create-cuti.dto';
import { Pegawai } from '../user/pegawai/entities/pegawai.entity'; // Pastikan Pegawai terimport

@Injectable()
export class CutiService {
  constructor(
    @InjectRepository(Cuti)
    private readonly cutiRepository: Repository<Cuti>,

    @InjectRepository(Pegawai)
    private readonly pegawaiRepository: Repository<Pegawai>, // Repository Pegawai
  ) {}

  // Menambah cuti baru
  async create(createCutiDto: CreateCutiDto): Promise<Cuti> {
    const { pegawai_id, alasan, mulai_tanggal, akhir_tanggal } = createCutiDto;

    // Mencari pegawai berdasarkan ID yang diberikan
    const pegawai = await this.pegawaiRepository.findOne({
      where: { id: pegawai_id },
    });
    if (!pegawai) {
      throw new BadRequestException(
        `Pegawai dengan ID ${pegawai_id} tidak ditemukan`,
      );
    }

    // Cek sisa cuti pegawai
    const sisaCuti = pegawai.sisa_cuti;
    const mulai = new Date(mulai_tanggal);
    const akhir = new Date(akhir_tanggal);

    // Menghitung durasi cuti dalam hari
    const durasiCuti =
      (akhir.getTime() - mulai.getTime()) / (1000 * 3600 * 24) + 1; // Durasi cuti dalam hari

    if (sisaCuti < durasiCuti) {
      throw new BadRequestException(
        `Sisa cuti pegawai tidak mencukupi. Sisa cuti: ${sisaCuti}, durasi cuti yang diminta: ${durasiCuti}`,
      );
    }

    // Menghitung total cuti tahun ini
    const tahunCuti = mulai.getFullYear();
    const cutiTahunIni = await this.cutiRepository
      .createQueryBuilder('cuti')
      .where('cuti.pegawai_id = :pegawai_id', { pegawai_id })
      .andWhere('YEAR(cuti.mulai_tanggal) = :tahun', { tahun: tahunCuti })
      .getMany();

    const totalCutiTahunIni = cutiTahunIni.reduce((total, cuti) => {
      const cutiMulai = new Date(cuti.mulai_tanggal);
      const cutiAkhir = new Date(cuti.akhir_tanggal);
      const durasi =
        (cutiAkhir.getTime() - cutiMulai.getTime()) / (1000 * 3600 * 24) + 1;
      return total + durasi;
    }, 0);

    if (totalCutiTahunIni + durasiCuti > 12) {
      throw new BadRequestException(
        `Pegawai tidak dapat mengambil lebih dari 12 hari cuti dalam satu tahun.`,
      );
    }

    // Cek apakah pegawai sudah mengambil cuti lebih dari 1 hari di bulan yang sama
    const bulanCuti = mulai.getMonth(); // Bulan dimulai dari 0
    const tahunCutiBulan = mulai.getFullYear();

    // Buat array untuk memeriksa semua hari dalam rentang tanggal cuti
    const cutiHariIni = [];
    let currentDate = new Date(mulai_tanggal);

    // Loop untuk memeriksa seluruh tanggal cuti
    while (currentDate <= akhir) {
      cutiHariIni.push(new Date(currentDate).toISOString().split('T')[0]); // Format yyyy-mm-dd
      currentDate.setDate(currentDate.getDate() + 1); // Menambah 1 hari
    }

    // Cek apakah ada cuti di bulan yang sama
    for (const tanggal of cutiHariIni) {
      const cutiBulanIni = await this.cutiRepository
        .createQueryBuilder('cuti')
        .where('cuti.pegawai_id = :pegawai_id', { pegawai_id })
        .andWhere('MONTH(cuti.mulai_tanggal) = :bulan', {
          bulan: bulanCuti + 1,
        })
        .andWhere('YEAR(cuti.mulai_tanggal) = :tahun', {
          tahun: tahunCutiBulan,
        })
        .andWhere('cuti.mulai_tanggal = :tanggal', { tanggal })
        .getMany();

      // Jika ada lebih dari satu cuti di bulan yang sama, lemparkan error
      if (cutiBulanIni.length > 0) {
        throw new BadRequestException(
          `Pegawai hanya dapat mengambil 1 hari cuti dalam bulan yang sama.`,
        );
      }
    }

    // Membuat instance Cuti dengan data yang sudah disesuaikan
    const cuti = this.cutiRepository.create({
      alasan,
      mulai_tanggal,
      akhir_tanggal,
      pegawai, // Menghubungkan objek Pegawai yang ditemukan
    });

    // Menyimpan entitas Cuti ke database
    const savedCuti = await this.cutiRepository.save(cuti);

    // Mengurangi sisa cuti pegawai setelah cuti disetujui
    pegawai.sisa_cuti -= durasiCuti;
    await this.pegawaiRepository.save(pegawai); // Menyimpan perubahan sisa cuti pegawai

    return savedCuti;
  }

  // Mengambil semua cuti
  async findAll(): Promise<Cuti[]> {
    // Melakukan join dengan tabel Pegawai dan memilih data Pegawai
    return this.cutiRepository
      .createQueryBuilder('cuti')
      .leftJoinAndSelect('cuti.pegawai', 'pegawai') // Join dengan tabel Pegawai
      .getMany(); // Mengambil semua data dengan join
  }

  // Mengambil cuti berdasarkan ID

  async findById(id: number): Promise<Cuti> {
    // Melakukan query untuk mencari Cuti berdasarkan ID dan melakukan LEFT JOIN dengan Pegawai
    const cuti = await this.cutiRepository
      .createQueryBuilder('cuti')
      .leftJoinAndSelect('cuti.pegawai', 'pegawai') // Join dengan Pegawai
      .where('cuti.id = :id', { id }) // Filter berdasarkan ID
      .getOne();

    if (!cuti) {
      throw new NotFoundException(`Cuti dengan ID ${id} tidak ditemukan`);
    }

    return cuti;
  }

  // Menghapus cuti berdasarkan ID
  async remove(id: number): Promise<void> {
    const cuti = await this.findById(id); // Menangani validasi jika cuti tidak ada
    await this.cutiRepository.remove(cuti);
  }
}
