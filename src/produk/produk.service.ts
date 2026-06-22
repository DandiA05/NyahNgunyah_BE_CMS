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
        const baseUrl = `${process.env.BASE_URL}/uploads/`;

        // 🔥 SORT: stock > 0 di atas, stock = 0 di bawah
        produkList.sort((a, b) => {
          const stockA = a.stock ?? 0;
          const stockB = b.stock ?? 0;

          if (stockA === 0 && stockB > 0) return 1;
          if (stockA > 0 && stockB === 0) return -1;
          return 0;
        });

        return produkList.map((produk) => {
          if (produk.foto && !produk.foto.startsWith('http')) {
            produk.foto = baseUrl + produk.foto;
          }
          produk.fotos = produk.fotos.map((foto) => {
            if (foto.foto && !foto.foto.startsWith('http')) {
              foto.foto = baseUrl + foto.foto;
            }
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
        if (!produk) return null;
        // Base URL for your images (make sure this is correct)
        const baseUrl = `${process.env.BASE_URL}/uploads/`;
        if (produk.foto && !produk.foto.startsWith('http')) {
          produk.foto = baseUrl + produk.foto;
        }

        if (produk.fotos.length > 0) {
          produk.fotos = produk.fotos.map((foto) => {
            if (foto.foto && !foto.foto.startsWith('http')) {
              foto.foto = baseUrl + foto.foto;
            }
            return foto;
          });
        }
        return produk;
      });
  }

  async create(data: Partial<Produk> & { fotos?: { foto: string; public_id?: string }[] }) {
    return this.connection.transaction(async (manager) => {
      const { fotos = [], ...produkData } = data;

      // Pastikan foto utama juga masuk ke daftar fotos tambahan
      if (produkData.foto) {
        const hasMainFoto = fotos.some((f) => f.foto === produkData.foto);
        if (!hasMainFoto) {
          fotos.unshift({
            foto: produkData.foto,
            public_id: produkData.foto_public_id || '',
          });
        }
      }

      // 1. Simpan produk
      const produk = await manager
        .getRepository(Produk)
        .save(manager.getRepository(Produk).create(produkData));

      // 2. Buat data foto jika ada
      let produkFotos: ProdukFotos[] = [];
      if (fotos.length > 0) {
        produkFotos = fotos.map((f) => {
          const foto = new ProdukFotos();
          foto.foto = f.foto;
          foto.public_id = f.public_id || '';
          foto.produk = produk;
          return foto;
        });
        await manager.getRepository(ProdukFotos).save(produkFotos);
      }

      // 3. Return hasil
      return {
        ...produk,
        fotos: produkFotos,
      };
    });
  }

  async update(
    id: number,
    updateData: Partial<Produk> & {
      fotos?: { id?: number; foto: string; public_id?: string }[];
    },
  ): Promise<Produk> {
    return this.connection.transaction(async (manager) => {
      const produkRepo = manager.getRepository(Produk);
      const produkFotoRepo = manager.getRepository(ProdukFotos);

      const produk = await produkRepo.findOne({
        where: { id },
        relations: ['fotos'],
      });

      if (!produk) {
        throw new NotFoundException('Produk not found');
      }

      const { fotos, ...produkData } = updateData;

      // Update fields
      produkRepo.merge(produk, produkData);
      await produkRepo.save(produk);

      if (fotos) {
        // Pastikan foto utama juga masuk ke daftar fotos jika belum ada
        const currentCoverFoto = produkData.foto || produk.foto;
        const currentCoverPublicId = produkData.foto_public_id || produk.foto_public_id;
        if (currentCoverFoto) {
          const hasMainFotoInIncoming = fotos.some((f) => f.foto === currentCoverFoto);
          const hasMainFotoInDb = produk.fotos.some((f) => f.foto === currentCoverFoto);
          if (!hasMainFotoInIncoming && !hasMainFotoInDb) {
            fotos.unshift({
              foto: currentCoverFoto,
              public_id: currentCoverPublicId || '',
            });
          }
        }

        // Hapus foto lama yang tidak ada di list fotos baru (berdasarkan ID)
        const incomingFotoIds = fotos.map((f) => f.id).filter(Boolean) as number[];
        const fotosToDelete = produk.fotos.filter((f) => !incomingFotoIds.includes(f.id));
        if (fotosToDelete.length > 0) {
          await produkFotoRepo.remove(fotosToDelete);
        }

        // Simpan / update foto
        for (const item of fotos) {
          if (item.id) {
            // Update existing
            const existing = produk.fotos.find((f) => f.id === item.id);
            if (existing) {
              existing.foto = item.foto;
              existing.public_id = item.public_id || '';
              await produkFotoRepo.save(existing);
            }
          } else {
            // Create new
            const foto = new ProdukFotos();
            foto.foto = item.foto;
            foto.public_id = item.public_id || '';
            foto.produk = produk;
            await produkFotoRepo.save(foto);
          }
        }
      }

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
    return this.produkRepository.softDelete(id);
  }
}
