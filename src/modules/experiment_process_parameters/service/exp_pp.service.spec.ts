import { Test, TestingModule } from '@nestjs/testing';
import { ExpPpService } from './exp_pp.service';

describe('ExpPpService', () => {
  let service: ExpPpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpPpService],
    }).compile();

    service = module.get<ExpPpService>(ExpPpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
