import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingsModule } from './bookings/bookings.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FileModule } from './file/file.module';
import { StorageCoreModule } from './storage-core/storage-core.module';
import { AuditCoreModule } from './audit-core/audit-core.module';
@Module({
  imports: [ConfigModule.forRoot(), BookingsModule, PrismaModule, FileModule, StorageCoreModule, AuditCoreModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
