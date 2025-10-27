import { Test, TestingModule } from '@nestjs/testing';
import { CutiService } from './cuti.service';

describe('CutiService', () => {
  let service: CutiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CutiService],
    }).compile();

    service = module.get<CutiService>(CutiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
