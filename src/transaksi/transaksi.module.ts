import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaksi } from '../transaksi/entities/transaksi.entity';
import { DetailTransaksi } from '../detail-transaksi/entities/detail-transaksi.entity';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';
import { DetailTransaksiService } from '../detail-transaksi/detail-transaksi.service';
import { ProdukService } from '../produk/produk.service';
import { Produk } from '../produk/entities/produk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaksi, DetailTransaksi, Produk])],
  controllers: [TransaksiController],
  providers: [TransaksiService, DetailTransaksiService, ProdukService],
})
export class TransaksiModule {}
