import { Module }                                                    from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { ClientController }                                          from './client.controller';
import { config }                                                    from './config';

@Module({
  imports    : [
    ClientsModule,
  ],
  controllers: [ClientController],
  providers: [
    {
      provide: ClientProxy,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.NATS,
          options  : {
            url  : process.env.NATS_SERVER,
            queue: config.serviceName,
          },
        })
      }
    }
  ],
  exports    : [
    ClientsModule,
    ClientProxy
  ],
})
export class ClientModule {

}
