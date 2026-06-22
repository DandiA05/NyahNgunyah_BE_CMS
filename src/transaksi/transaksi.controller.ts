import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { CreateTransaksiWithDetailsDto } from '../detail-transaksi/dto/create-transaksi-with-details.dto';
import { Transaksi } from '../transaksi/entities/transaksi.entity';

@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Post('')
  async createWithDetails(
    @Body() dto: CreateTransaksiWithDetailsDto,
  ): Promise<Transaksi> {
    return this.transaksiService.createWithDetails(dto);
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
