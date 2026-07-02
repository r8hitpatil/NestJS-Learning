import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private readonly redis:RedisClientType){}

    async cache(key:string,value:string){
        await this.redis.set(key,value);
    }
}