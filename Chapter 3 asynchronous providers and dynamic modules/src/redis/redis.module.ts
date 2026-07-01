import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { createClient } from 'redis';

@Module({
  providers: [{
    provide : 'REDIS_CLIENT',
    useFactory : async() => {
      const client = createClient({ url : process.env.REDIS_URL });
      await client.connect(); // here the whole app waits
      return client;
    }
  }],
  controllers: [RedisController],
  exports: ['REDIS_CLIENT']
})
export class RedisModule {}
