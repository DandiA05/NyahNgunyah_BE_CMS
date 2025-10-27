import { MigrationInterface, QueryRunner } from 'typeorm';
import { User, Gender } from 'src/user/user/entities/user.entity'; // Pastikan enum Gender diimpor

export class PostUser1705631083852 implements MigrationInterface {
  name = 'PostUser1705631083852';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepo = queryRunner.connection.getRepository(User);
    await userRepo.insert({
      firstName: 'Admin',
      lastName: '1',
      email: 'admin1@yopmail.com',
      dateOfBirth: new Date('1990-05-15'), // Ganti dengan tanggal lahir yang sesuai
      gender: Gender.FEMALE, // Gunakan enum Gender di sini
      password: '$2b$10$77NZjurH/pFUNe4A//kzyu40OmirJiRp3tTNbREBUV8FTagEcSOh6', // Kata sandi yang sudah di-hash
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted_at: null,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Implementasi rollback jika diperlukan
  }
}
