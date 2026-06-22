import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateProdukDto } from './dto/create-produk.dto';
import { ProdukService } from './produk.service';
import { Produk } from './entities/produk.entity';

@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Post()
  async create(@Body() createProdukDto: any) {
    return this.produkService.create(createProdukDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProdukDto: any,
  ) {
    return this.produkService.update(id, updateProdukDto);
  }

  @Get()
  async findAll(): Promise<Produk[]> {
    return this.produkService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Produk> {
    const result = await this.produkService.findOne(id);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.produkService.delete(id);

    if (result.affected === 0) {
      throw new Error('Produk not found');
    }
  }
}
