import { Test, TestingModule } from '@nestjs/testing';
import { RollbackService } from './rollback.service';

describe('RollbackService', () => {
  let service: RollbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollbackService],
    }).compile();

    service = module.get<RollbackService>(RollbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
