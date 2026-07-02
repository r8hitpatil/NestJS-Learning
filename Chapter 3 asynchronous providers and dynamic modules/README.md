# Async providers and dynamic modules

### Async providers

When we want our application to wait for a async operation before it starts accepting the requests is what we can achieve with the help of async providers.

Example: If we don't want to start the application before it create a database connection 

We can achieve it by useFactory
example We have a redis connection which is important to setup before even accepting any request :

What happens it fails to retrieve, the app crashes and won't start until we resolve the issue.

```
export const REDIS_CLIENT = 'REDIS_CLIENT';


@Module({
  providers: [{
    provide : REDIS_CLIENT,                                            // token
    useFactory : async() => {                                            // value of token
      const client = createClient({ url : process.env.REDIS_URL });
      await client.connect();                               // here the whole app waits
      return client;
    }
  }],
  controllers: [RedisController],
  exports: [REDIS_CLIENT]
})
export class RedisModule {}
```

How do we inject the token ?
```
@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENT) private readonly redis:RedisClientType){} // as usual

    async cache(key:string,value:string){
        await this.redis.set(key,value);
    }
}
```

Mostly try to use the export value because mistype of string might cause an issue where at compile time it is un-noticed and blows up at runtime.

Also we get the value not promise even if it is a async task because our app has to await before starting and the inject we have gets the plain value during that await.

Factory is async -> return a promise -> Nest awaits it at bootstrap -> injects resolved client

### Dynamic modules

