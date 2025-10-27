import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetailTransaksi } from './entities/detail-transaksi.entity';

@Injectable()
export class DetailTransaksiService {
  constructor(
    @InjectRepository(DetailTransaksi)
    private readonly detailRepository: Repository<DetailTransaksi>,
  ) {}

  async create(details: DetailTransaksi[]): Promise<DetailTransaksi[]> {
    return this.detailRepository.save(details);
  }
}
