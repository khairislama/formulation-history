import { Test, TestingModule } from '@nestjs/testing';
import { ExpMeasCondService } from './exp_meas_cond.service';

describe('ExpMeasCondService', () => {
  let service: ExpMeasCondService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpMeasCondService],
    }).compile();

    service = module.get<ExpMeasCondService>(ExpMeasCondService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
