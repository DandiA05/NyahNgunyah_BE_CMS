import { IsString } from 'class-validator';

export class CreateTransaksiDto {
  @IsString()
  nama_pembeli: string;

  @IsString()
  telp: string;

  @IsString()
  email: string;

  @IsString()
  alamat: string;

  @IsString()
  bukti_transfer: string; // This will store the filename, not the file itself

  metode_pengiriman: string;
  total: number;
  tanggal?: Date; // Automatically set in the service
  nomor_transaksi?: string; // Automatically set in the service
}
