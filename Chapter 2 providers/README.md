# Providors

## What is dependency injection container ?

Our whole NestJS compiles and creates an instance which has all the information about the services, modules, controllers, throughout thus where does it live ?

In main.ts
```
app = await NestFactory.create(AppModule);
```
This line creates a DI container so we can register our modules, controllers, services, etc..

## Importance of DI container ?

It is the most basic thing our NestJS application has because every single module registration , instances serving , services and all are served from this initial point.

### Providers 

When we have all our modules, services , controllers so we need to register them into the DI container thus to do that we have dependencies which can be injected into our container and this is handled by NestJS at runtime.

### Providers example

We usually inject the dependency inside a constructor and call it when we need it.

private readonly prismaService: PrismaService;

```
constructor(private readonly prismaService: PrismaService) {}
```

### Standard Provider

Properties of providers
1. Token : Reference we would use to call the provider ( inject the provider )
2. useClass : Class that has the value for token ( usually supplies via instantiating a class )

@Module({
    imports:[PrismaModule],
    controllers:[BookingsController],
    providers:[{
        provide : BookingsService, // token
        useClass: BookingsService  // class
    }]
})
export class BookingsModule {}
+

### Value Provider

When you want to inject a contant value we use the value provider
Here we have a token and static value that we would use as we want.

```
@Module({
    imports:[PrismaModule],
    controllers:[BookingsController],
    providers:[BookingsService,
        {
        provide : 'APP_PORT',     // token 
        useValue : '8080' // value
    }
    ]
})
export class BookingsModule {}
```

Here is the idea of how we can inject it and use it as a value

```
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService,
    // inject the token and we can get the value ( simpol )
        @Inject('APP_PORT') private readonly appPort: string
    ){}
}
```

### Non class token


When the providers key is not a class but a value of string or symbol is called non class token.

```
@Module({
    imports:[PrismaModule],
    controllers:[BookingsController],
    providers:[BookingsService,
    {
        provide : 'PORT',               // token
        useValue : process.env.PORT     // value
    }
    ]
})
export class BookingsModule {}
```

How do we it inject it ?
```
export class BookingsController {

    constructor(private readonly bookingsService: BookingsService,
        @Inject('PORT') private readonly port:string
    ){}
}
```

### Class Providers

We generally provide the token value as a class but also When you want to swap the service implementations at startup we can use conditionals.

```
@Module({
    imports:[PrismaModule],
    controllers:[BookingsController],
    providers:[
        {
        provide : 'APP_PORT',
        useValue : '8080'
    },
    {
        provide : 'PORT',
        useValue : process.env.PORT
    },
    {
        provide : BookingsService,                                      //token
        useClass : isProd ? BookingsService : MockBookingService        //value
    }
    ]
})
export class BookingsModule {}
```

### Factory Providers

When we want value that is built dynamically which is independent , async work , we simply inject the service and hand over the value.

useFactory can:  run logic  •  await async  •  pull in deps via `inject`

```
@Module({
    imports:[PrismaModule],
    controllers:[BookingsController],
    providers:[
    {
        provide : 'BOOKING_STATS',                                  // token
        useFactory : async (prisma: PrismaService) => {
            if(!isProd) return { total : 0 , note : 'mocked db' }   // value
            const total = await prisma.bookings.count();
            return { total , note : 'computed at startup' };
        },
        inject : [PrismaService],
    },
    ]
})
export class BookingsModule {}
```

How we inject it ?
Simply inject the token & you get the value.

```
@Controller('bookings')
export class BookingsController {

    constructor(private readonly bookingsService: BookingsService,
        @Inject('BOOKING_STATS') private readonly stats : { total : number, note : string },
    ){}

    @Get('stats/all')
    getStats() {
        return this.stats;
    }
```

### Alias Providers

When we want to use the same instance with different token name.
All the token names resolve to the same instance so no duplication.

```
@Module({
    imports:[PrismaModule],
    controllers:[BookingsController],
    providers:[
        {
        provide : BookingsService,
        useClass : isProd ? BookingsService : MockBookingService
    },
    {
        provide : 'BOOKING_ALIAS',      // token
        useExisting : BookingsService   // value
    }
    ]
})
export class BookingsModule {}
```

So here it can be confusing like if we have MockBookingService then it won't be pointing to same instance but no it is not how it works

In useExisting we actually create a token to refer the instance
here , if the BookingService is : MockBooking then the 'BOOKING_ALIAS' would point to the value of token BookingService in short.

  (alias token)      (target token)       (actual value)
'BOOKING_ALIAS'  ->  BookingService ->  MockBookingService

### Custom Providers

When we need to export the provider we can export it using exports array where we pass the token name inside it as a reference.

```
@Module({
    imports:[PrismaModule],
    controllers:[BookingsController],
    providers:[
    {
        provide : BookingsService,
        useClass : isProd ? BookingsService : MockBookingService
    },
    {
        provide : 'BOOKING_STATS',
        useFactory : async (prisma: PrismaService) => {
            if(!isProd) return { total : 0 , note : 'mocked db' }
            const total = await prisma.bookings.count();
            return { total , note : 'computed at startup' };
        },
        inject : [PrismaService],
    }
    ],
    exports : ['BOOKING_STATS'],
})
export class BookingsModule {}
```

If we want to inject it in another module we must import that module in particular and inject it as we used to do using the inject.

```
constructor(
    @Inject('BOOKING_STATS') private readonly stats: { total: number; note: string }
) {}
```
now it is not just a provider but related to our core module.