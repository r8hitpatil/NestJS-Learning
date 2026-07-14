import { Module } from '@nestjs/common';
import { AuditCoreService } from './audit-core.service';

@Module({
  providers: [AuditCoreService],
  exports: [AuditCoreService]
})
export class AuditCoreModule {}
