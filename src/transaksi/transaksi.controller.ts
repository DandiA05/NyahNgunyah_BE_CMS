import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
  Query,
} from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CreateTransaksiWithDetailsDto } from '../detail-transaksi/dto/create-transaksi-with-details.dto';
import { Transaksi } from '../transaksi/entities/transaksi.entity';
@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Post('')
  @UseInterceptors(
    FileInterceptor('bukti_transfer', {
      storage: diskStorage({
        destination: './uploads/bukti-transfer',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `bukti-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          return callback(
            new Error('Hanya file gambar atau PDF yang diperbolehkan!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async createWithDetails(
    @UploadedFile() bukti_transfer: Express.Multer.File,
    @Body() formData: any,
  ): Promise<Transaksi> {
    try {
      const purchaseDetails = JSON.parse(formData.purchase_details);

      const createTransaksiWithDetailsDto: any = {
        nama_pembeli: formData.nama_pembeli,
        alamat: formData.alamat,
        telp: formData.telp,
        email: formData.email,
        bukti_transfer: bukti_transfer?.filename ?? null,
        purchase_details: purchaseDetails,
      };

      console.log('🟩 DTO dikirim ke service:', createTransaksiWithDetailsDto);

      return await this.transaksiService.createWithDetails(
        createTransaksiWithDetailsDto,
      );
    } catch (error) {
      console.error('❌ Error parsing request:', error);
      throw error;
    }
  }

  // Get all transactions
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transaksiService.findAllFiltered({
      search,
      status,
      startDate,
      endDate,
    });
  }

  // Get a transaction by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transaksiService.findOne(Number(id));
  }

  // Update a transaction by ID
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransaksiDto: CreateTransaksiDto,
  ) {
    return this.transaksiService.update(Number(id), updateTransaksiDto);
  }

  // Delete a transaction by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transaksiService.remove(Number(id));
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.transaksiService.updateStatus(id, status);
  }
}
