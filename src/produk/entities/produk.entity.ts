import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ProdukFotos } from './produk_fotos.entity';

@Entity('produk')
export class Produk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column('text')
  desc: string;

  @Column({nullable: true})
  stock: number;

  @Column('decimal')
  harga: number;

  @Column()
  foto: string;

  @OneToMany(() => ProdukFotos, (item) => item.produk)
  fotos: ProdukFotos[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', select: false })
  deleted_at?: Date;
}
