import { Controller } from '@nestjs/common';
import { StorageCoreService } from 'src/storage-core/storage-core.service';

@Controller('file')
export class FileController {
  constructor(private readonly storageService: StorageCoreService){}
}