import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingsModule } from './bookings/bookings.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
@Module({
  imports: [ConfigModule.forRoot(), BookingsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}