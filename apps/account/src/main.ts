import { NestFactory }                    from '@nestjs/core';
import { AccountModule }                  from './account.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AccountModule, {
    transport: Transport.NATS,
    options  : {
      url: process.env.NATS_SERVER,
      queue: 'ACCOUNT_SERVICE'
    },
  });

  await app.listen(() => {

  });
}

bootstrap();
