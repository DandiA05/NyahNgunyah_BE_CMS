import { MigrationInterface, QueryRunner } from 'typeorm';
import { User, Gender } from 'src/user/user/entities/user.entity'; // Pastikan enum Gender diimpor

export class PostUser1705631083852 implements MigrationInterface {
  name = 'PostUser1705631083852';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepo = queryRunner.connection.getRepository(User);
    await userRepo.insert({
      firstName: 'Jona',
      lastName: 'Adhitya',
      email: 'jona.adhitya@smf-indonesia.co.id',
      dateOfBirth: new Date('1990-05-15'), // Ganti dengan tanggal lahir yang sesuai
      gender: Gender.MALE, // Gunakan enum Gender di sini
      password: '$2a$10$ON8vuVBWvMO8Wi0QU85X2OQI0w.4pv38vtEjbTK/zP.79lgEiZUXK', // Kata sandi yang sudah di-hash
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted_at: null,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Implementasi rollback jika diperlukan
  }
}
