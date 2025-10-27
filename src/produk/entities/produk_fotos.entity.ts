import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Produk } from './produk.entity';

@Entity('produk_fotos')
export class ProdukFotos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foto: string;

  @ManyToOne(() => Produk, (item) => item.fotos)
  @JoinColumn({ name: 'id_produk' })
  produk: Produk;
}
