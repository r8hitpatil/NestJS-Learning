# Basic crud operations in NestJS

# Initial setup

### Quick Setup for the Nest project : 

```
nest new . ( current project directory so ' . ')
```

### Config setup for env file in codebase


```
npm i --save @nestjs/config
```

Later in app.module.ts which we have to add the Config module so that at global level the env is easily accessible

In technical terms the key/value pair we have in root module is stored in env so we are just parsing those in this directory and ConfigService make us easier for access.

```
app.module.ts

imports : [ConfigModule.forRoot()]
```

Make sure you have imports, providers , controllers written well so that you have no issues in future 

### From where it starts ?

The **main.ts** bootstraps our application which creates new application instance

### Create a component ?

```
nest g co bookings
nest g s bookings
nest g mo bookings
```

co : controllers<br>
s : service<br>
mo : module<br>

### Prisma setup

``` 
npx prisma
```
```
npx prisma init
```
```
npx prisma migrate dev
```
```
npx prisma db pull
```
```
npx prisma studio
```


```npm install @prisma/adapter-pg```
for postgres

```
prisma.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(){
        const adapter = new PrismaPg({ connectionString : process.env.DATABASE_URL });
        super({ adapter });
    }
}
```

### Class Validators (DTO)

```
npm i --save class-validator class-transformer
```

```
main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```