import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pegawai } from './entities/pegawai.entity';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { GetTableDto } from 'src/helper/dto/general.dto';

@Injectable()
export class PegawaiService {
  constructor(
    @InjectRepository(Pegawai)
    private readonly mainRepository: Repository<Pegawai>,
  ) {}

  async findAll(payload: GetTableDto): Promise<Pegawai[]> {
    const sql = this.mainRepository.createQueryBuilder('a');

    const resultData = await sql.getMany();
    return resultData;
  }

  async findById(id: number): Promise<Pegawai | undefined> {
    const pegawai = await this.mainRepository
      .createQueryBuilder('pegawai')
      .where('pegawai.id = :id', { id })
      .getOne();

    return pegawai;
  }

  async create(createPegawaiDto: CreatePegawaiDto): Promise<Pegawai> {
    const { nama_depan, nama_belakang, email, no_hp, jenis_kelamin, address } =
      createPegawaiDto;

    // Buat objek Pegawai baru dengan properti yang diperlukan
    const pegawai = this.mainRepository.create({
      nama_depan, // Properti yang sesuai dengan kolom di entity
      nama_belakang, // Properti yang sesuai dengan kolom di entity
      email, // Properti yang sesuai dengan kolom di entity
      no_hp, // Properti yang sesuai dengan kolom di entity
      jenis_kelamin, // Properti yang sesuai dengan kolom di entity
      address, // Properti yang sesuai dengan kolom di entity
    });

    // Simpan entitas Pegawai ke database
    return this.mainRepository.save(pegawai);
  }

  async update(
    id: number,
    updatePegawaiDto: UpdatePegawaiDto,
  ): Promise<Pegawai> {
    // Cari Pegawai berdasarkan id
    const pegawai = await this.mainRepository.findOne({ where: { id } });

    // Jika Pegawai tidak ditemukan, lempar error
    if (!pegawai) {
      throw new NotFoundException(`Pegawai dengan id ${id} tidak ditemukan`);
    }

    // Update entitas Pegawai dengan data yang diterima dari DTO
    Object.assign(pegawai, updatePegawaiDto);

    // Simpan perubahan ke database
    return this.mainRepository.save(pegawai);
  }

  // Fungsi delete
  async delete(id: number): Promise<boolean> {
    const pegawai = await this.mainRepository.findOne({ where: { id } });

    if (!pegawai) {
      return false; // Jika pegawai tidak ditemukan, kembalikan false
    }

    await this.mainRepository.remove(pegawai); // Menghapus pegawai dari database
    return true; // Mengembalikan true jika berhasil menghapus
  }
}
