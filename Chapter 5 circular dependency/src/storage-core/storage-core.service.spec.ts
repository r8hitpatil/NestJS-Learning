import { Test, TestingModule } from '@nestjs/testing';
import { StorageCoreService } from './storage-core.service';

describe('StorageCoreService', () => {
  let service: StorageCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageCoreService],
    }).compile();

    service = module.get<StorageCoreService>(StorageCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
