import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

// Enum untuk jenis kelamin
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export class CreatePegawaiDto {
  @IsString()
  @IsNotEmpty()
  nama_depan: string; // Nama depan pegawai

  @IsString()
  @IsNotEmpty()
  nama_belakang: string; // Nama belakang pegawai

  @IsEmail()
  @IsNotEmpty()
  email: string; // Email pegawai

  @IsPhoneNumber(null)
  @IsNotEmpty()
  no_hp: string; // Nomor HP pegawai

  @IsEnum(Gender)
  @IsNotEmpty()
  jenis_kelamin: Gender; // Jenis kelamin pegawai (Male/Female)

  @IsString()
  @IsNotEmpty()
  address: string; // Alamat pegawai
}
