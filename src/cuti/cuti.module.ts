// src/cuti/cuti.module.ts
import { Module } from '@nestjs/common';
import { CutiController } from './cuti.controller';
import { CutiService } from './cuti.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuti } from './entities/cuti.entity';
import { Pegawai } from '../user/pegawai/entities/pegawai.entity'; // Import Pegawai entity

@Module({
  imports: [
    TypeOrmModule.forFeature([Cuti, Pegawai]), // Pastikan Pegawai juga diimport di sini
  ],
  controllers: [CutiController],
  providers: [CutiService],
})
export class CutiModule {}
