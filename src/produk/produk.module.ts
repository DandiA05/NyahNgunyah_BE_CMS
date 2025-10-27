import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from './entities/produk.entity';
import { ProdukService } from './produk.service';
import { ProdukController } from './produk.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Produk])],
  providers: [ProdukService],
  controllers: [ProdukController],
  exports: [ProdukService],
})
export class ProdukModule {}
