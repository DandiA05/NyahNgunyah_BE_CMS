import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProdukDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsNumber()
  @IsNotEmpty()
  harga: number;

}
