import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Res,
  Query,
  UseGuards,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { PegawaiService } from './pegawai.service';
import { GetTableDto } from 'src/helper/dto/general.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Pegawai } from './entities/pegawai.entity';

@Controller('pegawai')
export class PegawaiController {
  constructor(private readonly pegawaiService: PegawaiService) {}

  @Get()
  async findAll(@Query() query: GetTableDto, @Res() res: Response) {
    const data = await this.pegawaiService.findAll(query);
    const result = {
      statusCode: 200,
      message: 'Success',
      data,
    };
    res.status(200).send(result);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Pegawai | undefined> {
    return this.pegawaiService.findById(id);
  }

  @Post()
  async create(@Body() pegawai: Pegawai): Promise<Pegawai> {
    return this.pegawaiService.create(pegawai);
  }

  @Get(':id')
  async findPegawaiById(@Param('id') id: number): Promise<Pegawai | undefined> {
    return this.pegawaiService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() pegawai: Pegawai,
  ): Promise<Pegawai> {
    return this.pegawaiService.update(id, pegawai);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<string> {
    const result = await this.pegawaiService.delete(id);
    if (result) {
      return `Pegawai with ID ${id} deleted successfully`;
    } else {
      return `Pegawai with ID ${id} not found`;
    }
  }
}
