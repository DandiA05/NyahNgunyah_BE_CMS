// src/cuti/dto/create-cuti.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateCutiDto {
  @IsString()
  @IsNotEmpty()
  alasan: string;

  @IsDateString()
  @IsNotEmpty()
  mulai_tanggal: string;

  @IsDateString()
  @IsNotEmpty()
  akhir_tanggal: string;

  @IsInt()
  @Min(1)
  pegawai_id: number;
}
