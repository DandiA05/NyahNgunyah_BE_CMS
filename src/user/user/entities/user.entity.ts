// src/user/user.entity.ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

// Enum untuk jenis kelamin
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    name: 'nama_depan',
  })
  firstName: string;

  @Column({
    length: 50,
    name: 'nama_belakang',
  })
  lastName: string;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    type: 'date',
    name: 'tanggal_lahir',
    nullable: true, // Kolom ini bisa null jika tidak diisi
  })
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    name: 'jenis_kelamin',
  })
  gender: Gender;

  @Column({
    length: 255,
  })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', select: false })
  deleted_at?: Date;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}
