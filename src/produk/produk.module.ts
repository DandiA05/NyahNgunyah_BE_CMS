import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from './entities/produk.entity';
import { ProdukFotos } from './entities/produk_fotos.entity';
import { ProdukService } from './produk.service';
import { ProdukController } from './produk.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Produk, ProdukFotos])],
  providers: [ProdukService],
  controllers: [ProdukController],
  exports: [ProdukService],
})
export class ProdukModule {}
