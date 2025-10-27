// detail-transaksi.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaksi } from '../../transaksi/entities/transaksi.entity';
import { Produk } from '../../produk/entities/produk.entity';

@Entity()
export class DetailTransaksi {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaksi, (transaksi) => transaksi.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaksi_id' })
  transaksi: Transaksi;

  @ManyToOne(() => Produk) // Automatically fetch product details
  @JoinColumn({ name: 'produk_id' })
  produk: Produk;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
