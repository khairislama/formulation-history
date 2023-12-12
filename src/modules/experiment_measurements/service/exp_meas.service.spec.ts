import { Test, TestingModule } from '@nestjs/testing';
import { ExpMeasService } from './exp_meas.service';

describe('ExpMeasService', () => {
  let service: ExpMeasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpMeasService],
    }).compile();

    service = module.get<ExpMeasService>(ExpMeasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
