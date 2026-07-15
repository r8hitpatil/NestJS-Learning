import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { StorageCoreModule } from 'src/storage-core/storage-core.module';
import { FileController } from './file.controller';

@Module({
  imports : [StorageCoreModule],
  providers: [FileService],
  controllers: [FileController]
})
export class FileModule {}