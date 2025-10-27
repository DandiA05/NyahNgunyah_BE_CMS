import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Gender } from './../../pegawai/entities/pegawai.entity'; // Import enum Gender

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  no_hp?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
