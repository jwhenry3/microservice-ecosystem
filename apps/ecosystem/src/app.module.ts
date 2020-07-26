import { Module }           from '@nestjs/common';
import { AppService }       from './app.service';
import { HealthController } from './health/health.controller';
import { AppGateway }      from './app.gateway';
import { EventController } from './event/event.controller';
import { LoginController } from './login/login.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ClientModule }   from '../../../lib/server/client.module';
import { ConfigModule }   from '@nestjs/config';

@Module({
  imports    : [
    ClientModule,
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HealthController, LoginController, EventController],
  providers  : [AppService, AppGateway],
})
export class AppModule {
}
