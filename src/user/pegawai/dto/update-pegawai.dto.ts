import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Gender } from './../entities/pegawai.entity'; // Import enum Gender

export class UpdatePegawaiDto {
  @IsOptional()
  @IsString()
  nama_depan?: string;

  @IsOptional()
  @IsString()
  nama_belakang?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  no_hp?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(Gender)
  jenis_kelamin?: Gender;
}
