import { Test, TestingModule } from '@nestjs/testing';
import { ExpIngService } from './exp_ing.service';

describe('ExpIngService', () => {
  let service: ExpIngService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpIngService],
    }).compile();

    service = module.get<ExpIngService>(ExpIngService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
