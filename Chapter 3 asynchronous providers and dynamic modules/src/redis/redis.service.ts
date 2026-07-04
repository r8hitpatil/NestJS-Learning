import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { REDIS_CLIENT } from './types/redis.contant';

@Injectable()
export class RedisService implements OnApplicationShutdown{
    constructor(@Inject(REDIS_CLIENT) private readonly redis:RedisClientType){}
    // to avoid memory leaks we do implement OnApplicationShutdown which quits or exits our application as our connection build fails
    async onApplicationShutdown() {
        await this.redis.quit();
    }

    async cache(key:string,value:string){
        await this.redis.set(key,value);
    }
}