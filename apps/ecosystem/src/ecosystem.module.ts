import { Module }           from '@nestjs/common';
import { AppService }       from './app.service';
import { HealthController } from './health/health.controller';
import { EventGateway }     from './event/event.gateway';
import { EventController }  from './event/event.controller';
import { LoginController }  from './login/login.controller';
import { TerminusModule }   from '@nestjs/terminus';
import { ConfigModule }     from '@nestjs/config';
import { AccountModule }    from '../../account/src/account.module';
import { AuthModule }       from '../../auth/src/auth.module';
import { PresenceModule }   from '../../presence/src/presence.module';
import { StateModule }      from '../../state/src/state.module';
import { ClientModule }     from '../../../lib/server/client.module';
let microservices = [];
if (process.env.ALL_IN_ONE) {
  microservices = [
    AccountModule.forRoot(),
    AuthModule.forRoot(),
    PresenceModule.forRoot(),
    StateModule.forRoot()
  ];
}
@Module({
  imports    : [
    ...microservices,
    ClientModule,
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HealthController, LoginController, EventController],
  providers  : [AppService, EventGateway],
})
export class EcosystemModule {
}
