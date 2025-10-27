// src/cuti/cuti.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pegawai } from '../../user/pegawai/entities/pegawai.entity'; // Pastikan impor Pegawai

@Entity()
export class Cuti {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  alasan: string;

  @Column({ type: 'date' })
  mulai_tanggal: string;

  @Column({ type: 'date' })
  akhir_tanggal: string;

  @ManyToOne(() => Pegawai, (pegawai) => pegawai.cuti) // Relasi ManyToOne ke Pegawai
  @JoinColumn({ name: 'pegawai_id' }) // Nama kolom yang akan menyimpan ID pegawai
  pegawai: Pegawai; // Properti yang akan menyimpan referensi Pegawai

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', select: false })
  deleted_at?: Date;
}
