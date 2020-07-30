import { NestFactory }                    from '@nestjs/core';
import { StateModule }                    from './state.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(StateModule, {
    transport: Transport.NATS,
    options  : {
      url  : process.env.NATS_SERVER,
      queue: 'STATE_SERVICE',
    },
  });

  await app.listen(() => {

  });
}

bootstrap();
