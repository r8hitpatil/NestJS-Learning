import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingsModule } from './bookings/bookings.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { BookingsController } from './bookings/bookings.controller.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BookingsService } from './bookings/bookings.service.js';
import { DogModule } from './dog/dog.module';
@Module({
  imports: [ConfigModule.forRoot(), BookingsModule, PrismaModule, DogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
