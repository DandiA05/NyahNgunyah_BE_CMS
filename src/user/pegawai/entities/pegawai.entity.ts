import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Cuti } from 'src/cuti/entities/cuti.entity';

// Enum untuk jenis kelamin
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

@Entity()
export class Pegawai {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  nama_depan: string;

  @Column({
    length: 50,
  })
  nama_belakang: string;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    length: 15, // Menggunakan panjang yang sesuai untuk nomor HP
  })
  no_hp: string;

  @Column({
    length: 255,
  })
  address: string;

  @Column({
    default: 12,
  })
  sisa_cuti: number;

  @Column({
    type: 'enum',
    enum: Gender,
    name: 'jenis_kelamin',
  })
  jenis_kelamin: Gender;

  // Relasi OneToMany dengan Cuti
  @OneToMany(() => Cuti, (cuti) => cuti.pegawai) // Banyak cuti untuk satu pegawai
  cuti: Cuti[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', select: false })
  deleted_at?: Date;
}
