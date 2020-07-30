import { NestFactory }                    from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PresenceModule }                 from '../apps/presence/src/presence.module';
import { config }                         from './config';

export async function createMicroservice() {
  return await NestFactory.createMicroservice<MicroserviceOptions>(PresenceModule, {
    transport: Transport.NATS,
    options  : {
      url: process.env.NATS_SERVER,
      queue: config.serviceName,
    },
  });
}
