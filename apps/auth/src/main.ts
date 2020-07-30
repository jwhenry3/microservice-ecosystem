import { NestFactory }                    from '@nestjs/core';
import { AuthModule }                     from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.NATS,
    options  : {
      url  : process.env.NATS_SERVER,
      queue: 'AUTH_SERVICE',
    },
  });

  await app.listen(() => {

  });
}

bootstrap();
