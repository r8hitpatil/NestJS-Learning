import { Module } from '@nestjs/common';
import { StorageCoreService } from './storage-core.service';

@Module({
  imports : [],
  providers: [StorageCoreService],
  exports: [StorageCoreService]
})
export class StorageCoreModule {}
