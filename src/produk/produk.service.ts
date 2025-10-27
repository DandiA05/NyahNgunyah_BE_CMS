import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Produk } from './entities/produk.entity';
import { CreateProdukDto } from './dto/create-produk.dto';
import { ProdukFotos } from './entities/produk_fotos.entity';

@Injectable()
export class ProdukService {
  constructor(
    @InjectRepository(Produk)
    private produkRepository: Repository<Produk>,

    private connection: Connection,
  ) {}

  findAll() {
    return this.produkRepository
      .find({ relations: ['fotos'] })
      .then((produkList) => {
        // Base URL for your images (make sure this is correct)
        const baseUrl = `${process.env.BASE_URL}/uploads/`;

        return produkList.map((produk) => {
          // Add the base URL to the image filename
          produk.foto = produk.foto && baseUrl + produk.foto;
          produk.fotos = produk.fotos.map((foto) => {
            foto.foto = baseUrl + foto.foto;
            return foto;
          });
          return produk;
        });
      });
  }

  findOne(id: number) {
    return this.produkRepository
      .findOne({ where: { id }, relations: ['fotos'] })
      .then((produk) => {
        // Base URL for your images (make sure this is correct)
        const baseUrl = `${process.env.BASE_URL}/uploads/`;
        if (produk.foto) {
          produk.foto = baseUrl + produk.foto;
        }

        if (produk.fotos.length > 0) {
          produk.fotos = produk.fotos.map((foto) => {
            foto.foto = baseUrl + foto.foto;
            return foto;
          });
        }
        return produk;
      });
  }

  async create(data: Partial<Produk>, fotos: Express.Multer.File[]) {
    return this.connection.transaction(async (manager) => {
      // 1. Simpan produk
      const produk = await manager
        .getRepository(Produk)
        .save(manager.getRepository(Produk).create({ ...data, foto: '' }));

      // 2. Buat data foto
      const produkFotos = fotos.map((file) => {
        const foto = new ProdukFotos();
        foto.foto = file.filename;
        foto.produk = produk;
        return foto;
      });

      // 3. Simpan ke produk_fotos
      await manager.getRepository(ProdukFotos).save(produkFotos);

      // 4. Return hasil
      return {
        ...produk,
        fotos: produkFotos,
      };
    });
  }

  async update(
    id: number,
    updateProdukDto: Partial<Produk>,
    newFotos: Express.Multer.File[],
    existingFileIds: number[], // id foto yg mau dipertahankan
  ): Promise<Produk> {
    return this.connection.transaction(async (manager) => {
      // 1. Cari produk yg mau diupdate
      const produkRepo = manager.getRepository(Produk);
      const produkFotoRepo = manager.getRepository(ProdukFotos);

      const produk = await produkRepo.findOne({
        where: { id },
        relations: ['fotos'],
      });

      if (!produk) {
        throw new Error('Produk not found');
      }

      // 2. Update field produk
      produkRepo.merge(produk, updateProdukDto);
      await produkRepo.save(produk);

      // 3. Hapus foto yg sudah tidak ada di existingFileIds
      if (existingFileIds && existingFileIds.length > 0) {
        // cari foto yg id-nya tdk ada di existingFileIds
        const fotosToDelete = produk.fotos.filter(
          (f) => !existingFileIds.includes(f.id),
        );

        if (fotosToDelete.length > 0) {
          // bisa juga hapus file fisik disini jika perlu
          await produkFotoRepo.remove(fotosToDelete);
        }
      } else {
        // Kalau existingFileIds kosong berarti hapus semua foto lama
        await produkFotoRepo.remove(produk.fotos);
      }

      // 4. Tambahkan foto baru
      if (newFotos && newFotos.length > 0) {
        const newProdukFotos = newFotos.map((file) => {
          const foto = new ProdukFotos();
          foto.foto = file.filename;
          foto.produk = produk;
          return foto;
        });
        await produkFotoRepo.save(newProdukFotos);
      }

      // 5. Reload produk dengan foto baru
      const updatedProduk = await produkRepo.findOne({
        where: { id },
        relations: ['fotos'],
      });

      return updatedProduk!;
    });
  }

  async getPriceByProductId(id: number): Promise<number> {
    const produk = await this.produkRepository
      .createQueryBuilder('produk')
      .select('produk.harga')
      .where('produk.id = :id', { id })
      .getOne();

    if (!produk) {
      throw new Error(`Product with ID ${id} not found`); // Menangani error jika produk tidak ditemukan
    }

    return produk.harga;
  }

  delete(id: number) {
    return this.produkRepository.delete(id);
  }
}
