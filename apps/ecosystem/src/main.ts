import { NestFactory }     from '@nestjs/core';
import { EcosystemModule } from './ecosystem.module';
import { Transport }       from '@nestjs/microservices';
import { config }          from '../../../lib/config';

async function bootstrap() {
  const app = await NestFactory.create(EcosystemModule);
  app.connectMicroservice({
    name     : config.serviceName,
    transport: Transport.NATS,
    options  : {
      url: process.env.NATS_SERVER,
    },
  });
  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}

bootstrap();
