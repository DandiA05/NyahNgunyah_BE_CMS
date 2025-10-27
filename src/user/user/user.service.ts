// src/user/user.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { GetTableDto } from 'src/helper/dto/general.dto';
import { ChangePasswordUserDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly mainRepository: Repository<User>,
  ) {}

  async findAll(payload: GetTableDto): Promise<User[]> {
    const sql = this.mainRepository.createQueryBuilder('a');

    const resultData = await sql.getMany();
    return resultData;
  }

  async findById(id: number): Promise<User | undefined> {
    const userDivisionId = await this.mainRepository.findOne({ where: { id } });
    const user = await this.mainRepository
      .createQueryBuilder('user')

      .getOne();

    return user;
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.mainRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.dateOfBirth = createUserDto.dateOfBirth;
    user.gender = createUserDto.gender;

    // Hash the password before saving it
    user.password = await bcrypt.hash(createUserDto.password, 10);

    return this.mainRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.mainRepository.findOne({ where: { email } });
  }
  async update(id: number, updatePegawaiDto: UpdateUserDto): Promise<User> {
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
  // Add other database operations as needed

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordUserDto,
  ): Promise<void> {
    const { current_password, new_password, re_new_password } =
      changePasswordDto;

    // Find the user by ID
    const user = await this.mainRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    if (!(await user.comparePassword(current_password))) {
      throw new UnauthorizedException('Invalid current password');
    }

    // Validate new password
    if (new_password !== re_new_password) {
      throw new BadRequestException(
        'New password and re-entered password do not match',
      );
    }

    // Update user password
    user.password = await bcrypt.hash(new_password, 10);
    await this.mainRepository.save(user);
  }

  async delete(id: number): Promise<boolean> {
    const pegawai = await this.mainRepository.findOne({ where: { id } });

    if (!pegawai) {
      return false; // Jika pegawai tidak ditemukan, kembalikan false
    }

    await this.mainRepository.remove(pegawai); // Menghapus pegawai dari database
    return true; // Mengembalikan true jika berhasil menghapus
  }
}
