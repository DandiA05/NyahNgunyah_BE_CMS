import { IsNumber } from 'class-validator';

export class CreateDetailTransaksiDto {
  @IsNumber()
  produk_id: number;

  @IsNumber()
  quantity: number;
}
