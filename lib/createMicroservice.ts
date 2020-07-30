import { NestFactory }                    from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config }                         from './config';

export async function createMicroservice(module) {
  return await NestFactory.createMicroservice<MicroserviceOptions>(module, {
    transport: Transport.NATS,
    options  : {
      url: process.env.NATS_SERVER,
      queue: config.serviceName,
    },
  });
}
