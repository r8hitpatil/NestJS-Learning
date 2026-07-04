import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true
  }));

  // This tells NestJS to listen for Ctrl+C (SIGINT) or Docker stops (SIGTERM)
  // and execute your OnApplicationShutdown lifecycle hooks.
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
