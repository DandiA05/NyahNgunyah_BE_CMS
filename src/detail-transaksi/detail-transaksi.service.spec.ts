import { Test, TestingModule } from '@nestjs/testing';
import { DetailTransaksiService } from './detail-transaksi.service';

describe('DetailTransaksiService', () => {
  let service: DetailTransaksiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailTransaksiService],
    }).compile();

    service = module.get<DetailTransaksiService>(DetailTransaksiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
