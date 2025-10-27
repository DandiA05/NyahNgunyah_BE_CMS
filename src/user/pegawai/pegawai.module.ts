// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PegawaiController } from './pegawai.controller';
import { PegawaiService } from './pegawai.service';
import { Pegawai } from './entities/pegawai.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pegawai])],
  controllers: [PegawaiController],
  providers: [PegawaiService],
  exports: [PegawaiService],
})
export class PegawaiModule {}
