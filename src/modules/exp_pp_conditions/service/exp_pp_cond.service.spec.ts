import { Test, TestingModule } from '@nestjs/testing';
import { ExpPpCondService } from './exp_pp_cond.service';

describe('ExpPpCondService', () => {
  let service: ExpPpCondService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpPpCondService],
    }).compile();

    service = module.get<ExpPpCondService>(ExpPpCondService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
