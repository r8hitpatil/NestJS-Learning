import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { StorageCoreModule } from 'src/storage-core/storage-core.module';
import { StorageCoreService } from 'src/storage-core/storage-core.service';

@Module({
  imports : [StorageCoreModule],
  providers: [FileService]
})
export class FileModule {
  constructor(private readonly storageService: StorageCoreService){}
}