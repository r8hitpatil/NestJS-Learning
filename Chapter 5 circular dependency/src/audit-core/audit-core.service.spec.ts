import { Test, TestingModule } from '@nestjs/testing';
import { AuditCoreService } from './audit-core.service';

describe('AuditCoreService', () => {
  let service: AuditCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditCoreService],
    }).compile();

    service = module.get<AuditCoreService>(AuditCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
