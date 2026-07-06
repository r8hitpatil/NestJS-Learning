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

### Dynamic modules vs Static modules

Difference between hardcoded modules @Modules and modules which are made to configure themselves at runtime 

#### Static modules

The static / hardcoded modules are simple and easy to use but we cannot configure as per our needs

Example of hardcoded module and it's uses

```
// we have prisma module here

@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
```

```
// we hardcoded that prisma module to use prisma services

@Module({
    imports:[PrismaModule],
    controllers:[BookingsController],
    providers:[BookingsService]
})
export class BookingsModule {}
```

```
// how do we use it ?
// we can simply get the PrismaService from that PrismaModule imports

@Injectable()
export class BookingsService {
  constructor(private readonly prisma : PrismaService){}
}
```

Another great example of Static module is below where even if we are fetching the url but the module in the end is dynamic more importantly the url when we have that module imported is gonna be static

```
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
```

How is it static ?
```
@Module({
    imports:[PrismaModule,RedisModule], //see the whole module is imported not url so i.e static
    controllers:[BookingsController],
    providers:[BookingsService]
})
export class BookingsModule {}
```


#### Dynamic modules

We can simply get those modules but with our configurations in it as dynamic values being used 


ex : before we had the value being fetch with the help of useFactory provider
```

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
```

now how do we make it dynamic ?
simply by using forRoot() and DynamicModule type we can share our RedisService appwide with asynchronous nature of connecting with the url inside the factory.


#### forRoot() is for configuring in the module once and app-wide using them with no need of re-configuring or re-declaring just configure once at app module done.

```
export const REDIS_CLIENT = 'REDIS_CLIENT'

@Module({})
export class RedisModule {
  static forRoot(url:string ):DynamicModule {
    return {
      module : RedisModule,
      providers : [{
        provide : REDIS_CLIENT,
        useFactory : async () => {
          const client = createClient({ url });
          await client.connect();
          return client;
        },
      },
      RedisService,
    ],
      exports : [REDIS_CLIENT],
    }
  }
}
```

How will it be imported !
Simply as given below.

```
app.module.ts

@Module({
  imports: [ConfigModule.forRoot(), BookingsModule, PrismaModule, RedisModule.forRoot(process.env.REDIS_URL!)],  // url is here mentioned
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Now in above example I've not exported the RedisService, 
If we want that service to be part of public API then we would want it to be exported but if the RedisService is internals for some reason then it is not worth exporting and a bad practice as well

NOTE : But a catch is there to worth noting about using the '!' because there might be undefined at run time and can fail silently thus to use config.forRootAsync we are going to explore the forRootAsync later.

#### Some naming conventions worth mention apart from the forRoot()

#### register() is same as the forRoot() but the configuration in module must be done, every time we want to use it in some module !

#### forFeature() means providing only specific domain or features to the current module.

#### forRootAsync() allows consumer to inject the application services like ConfigService to resolve the configurations asynchronously before the module is initialized.

```
redis.async.type.ts
// We are defining some standardized values for our RedisConnection. No hardcoding the dynamic volume because in future we cannot re-use the things with different setup

export interface RedisAsyncOptions {
    imports?: any[];
    inject?:any[];
    useFactory: (...args:any[]) => Promise<string> | string;
}
```

```
redis.module.ts

@Module({})
export class RedisModule {
  static forRootAsync(options:RedisAsyncOptions):DynamicModule { // options param needed
    return {
      global : true,
      module : RedisModule,
      imports : options.imports || [], // fetch those imports
      providers : [{
        provide : REDIS_CLIENT,
        useFactory : async (...args) => {
          const url = await options.useFactory(...args); // fetch those useFactory and provide the promise in return
          const client = createClient({ url });
          await client.connect();
          return client;
        },
        inject : options.inject || [], // fetch those injections
      },
      RedisService,
    ],
      exports : [RedisService],
    }
  }
}
```

```
app.module.ts

// Pass an object literal that satisfies the RedisAsyncOptions interface.


@Module({
  imports: [ConfigModule.forRoot(), BookingsModule, PrismaModule, RedisModule.forRootAsync({
    imports : [ConfigModule],
    inject : [ConfigService],
    useFactory: (config:ConfigService) => {
      return config.getOrThrow<string>('REDIS_URL');
    }
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

#### Unsolved Redis memory leak mystery ( Most important topic )
We close our application , do we really disconnect from the redis connection we have ?
No apparently

Thus to close the connection we have to execute a onApplicationShutdown() which would quit the connected RedisService thus there is no memory leak for our redis !

Why we need it !!
Even if you close the connection with Ctrl + c we actually don't remove the plug from the redis end , it thinks the Node is active so keep waiting for it , might hit the maxClient limit if all our apps are closed in this way thus use the safe closing with app shutdown

```
@Injectable()
export class RedisService implements OnApplicationShutdown{
    constructor(@Inject(REDIS_CLIENT) private readonly redis:RedisClientType){}
    // to avoid memory leaks we quit the connection with redis from the tcp
    async onApplicationShutdown() {
        await this.redis.quit();
    }

    async cache(key:string,value:string){
        await this.redis.set(key,value);
    }
}
```

```
main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true
  }));

  // This tells NestJS to listen for Ctrl+C
  // and execute your OnApplicationShutdown otherwise it is of no use
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
```

#### Do we have to write the code block that heavy ? NO

NestJS takes care of our developers by giving some hand about building a module builder

Step 1 : Define your definition for your provider in separate file which would have info about what module options like url , token , etc.. in what format as well and then we would need ConfigModuleClass that is for extending out module ( provider ) which would give our module necessary stuff of providing , injecting behind the scenes no need to write more code in providers

Ex: For stripe module we created stripe.module-definition.ts
```

export interface StripeModuleOptions{
    apiKey: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = (
    new ConfigurableModuleBuilder<StripeModuleOptions>()
    .setClassMethodName('forRoot')
    .build()
)
```

Thus our module configurations we need is almost just few lines of code , extend our module ( provider ) with ConfigModuleClass

Step 2 : Pass the necessary params to connect your service you need

In our service of our provider we inject to get the necessary tokens for building a connection
```

@Injectable()
export class StripeService {
  private stripeClient: Stripe;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: StripeModuleOptions) {
    
    this.stripeClient = new Stripe(this.options.apiKey, {
      apiVersion: '2026-06-24.dahlia',
    });
  }
}
```

Extending the ConfigModuleClass to enable the ConfigBuilder

```

@Module({
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule extends ConfigurableModuleClass {}
```

Step 3 : Simply pass down the configs as we did last time for provider module in the app.module.ts

```
StripeModule.forRootAsync({
  imports : [ConfigModule],
  inject : [ConfigService],
  useFactory : (config:ConfigService) => {
    return {
      apiKey : config.getOrThrow<string>('STRIPE_SECRET_KEY'),
    }
  }
  })]
```