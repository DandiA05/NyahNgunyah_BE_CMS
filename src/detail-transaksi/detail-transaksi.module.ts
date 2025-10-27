import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailTransaksiService } from './detail-transaksi.service';
import { DetailTransaksi } from './entities/detail-transaksi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailTransaksi])],
  providers: [DetailTransaksiService],
  exports: [DetailTransaksiService],
})
export class DetailTransaksiModule {}
