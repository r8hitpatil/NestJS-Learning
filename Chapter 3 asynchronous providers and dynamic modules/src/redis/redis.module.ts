import { DynamicModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { RedisAsyncOptions } from './types/redis.async.type';
import { REDIS_CLIENT } from './types/redis.contant';

@Module({})
export class RedisModule {
  static forRootAsync(options:RedisAsyncOptions):DynamicModule {
    return {
      global : true,
      module : RedisModule,
      imports : options.imports || [],
      providers : [{
        provide : REDIS_CLIENT,
        useFactory : async (...args) => {
          const url = await options.useFactory(...args);
          const client = createClient({ url });
          await client.connect();
          return client;
        },
        inject : options.inject || [],
      },
      RedisService,
    ],
      exports : [RedisService],
    }
  }
}