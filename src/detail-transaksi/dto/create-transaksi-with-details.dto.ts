export class CreateTransaksiWithDetailsDto {
  nama_pembeli: string;
  alamat: string;
  telp: string;
  email: string;
  bukti_transfer: string;
  total_harga: number;
  purchase_details: {
    produk_id: number;
    quantity: number;
  }[];
}
