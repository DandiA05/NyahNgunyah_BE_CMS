import { Test, TestingModule } from '@nestjs/testing';
import { DetailTransaksiController } from './detail-transaksi.controller';

describe('DetailTransaksiController', () => {
  let controller: DetailTransaksiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailTransaksiController],
    }).compile();

    controller = module.get<DetailTransaksiController>(DetailTransaksiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
