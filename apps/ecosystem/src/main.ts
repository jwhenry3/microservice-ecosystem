import { NestFactory } from '@nestjs/core';
import { AppModule }   from './app.module';
import { Transport }   from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    name     : process.env.SERVICE_NAME || 'MAIN_SERVICE',
    transport: Transport.NATS,
    options  : {
      url: process.env.NATS_SERVER,
    },
  });
  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}

bootstrap();
