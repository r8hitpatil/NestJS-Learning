import { Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookingsModule } from './bookings/bookings.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RedisModule } from './redis/redis.module';
import { StripeModule } from './stripe/stripe.module';
@Module({
  imports: [ConfigModule.forRoot(), BookingsModule, PrismaModule, RedisModule.forRootAsync({
    imports : [ConfigModule],
    inject : [ConfigService],
    useFactory: (config:ConfigService) => {
      return config.getOrThrow<string>('REDIS_URL');
    }
  },
),StripeModule.forRootAsync({
  imports : [ConfigModule],
  inject : [ConfigService],
  useFactory : (config:ConfigService) => {
    return {
      apiKey : config.getOrThrow<string>('STRIPE_SECRET_KEY'),
    }
  }
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}