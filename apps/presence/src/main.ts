import { NestFactory }                    from '@nestjs/core';
import { PresenceModule }                 from './presence.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PresenceModule, {
    transport: Transport.NATS,
    options  : {
      url: process.env.NATS_SERVER,
      queue: 'PRESENCE_SERVICE',
    },
  });

  await app.listen(() => {

  });
}

bootstrap();
