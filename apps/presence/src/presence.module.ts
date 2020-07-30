import { Module }        from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService }    from './app.service';
import { ClientModule }  from '../../../lib/client.module';
import { ConfigModule }  from '@nestjs/config';

@Module({
  imports    : [
    ClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers  : [AppService],
})
export class PresenceModule {
}
