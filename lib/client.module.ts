import { Module }                   from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientController }         from './client.controller';
import { config }                   from './config';

@Module({
  imports    : [
    ClientsModule.register([
      {
        name     : config.serviceName,
        transport: Transport.NATS,
        options  : {
          url  : process.env.NATS_SERVER,
          queue: config.serviceName,
        },
      },
    ]),
  ],
  controllers: [ClientController],
  exports    : [
    ClientsModule,
  ],
})
export class ClientModule {

}
