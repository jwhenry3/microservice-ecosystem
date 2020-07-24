import { DynamicModule, Module }    from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientController }         from './client.controller';

@Module({
  imports    : [
    ClientsModule.register([
      {
        name     : process.env.SERVICE_NAME || 'MAIN_SERVICE',
        transport: Transport.NATS,
        options  : {
          url  : process.env.NATS_SERVER,
          queue: process.env.SERVICE_NAME || 'MAIN_SERVICE',
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
