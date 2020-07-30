import { Module }           from '@nestjs/common';
import { AppService }       from './app.service';
import { HealthController } from './health/health.controller';
import { EventGateway }    from './event/event.gateway';
import { EventController } from './event/event.controller';
import { LoginController } from './login/login.controller';
import { TerminusModule }  from '@nestjs/terminus';
import { ClientModule }    from '../../../lib/client.module';
import { ConfigModule }    from '@nestjs/config';
import { AccountModule }   from '../../account/src/account.module';
import { AuthModule }      from '../../auth/src/auth.module';
import { PresenceModule }  from '../../presence/src/presence.module';
import { StateModule }     from '../../state/src/state.module';
let microservices = [];
if (process.env.ALL_IN_ONE) {
  microservices = [
    AccountModule,
    AuthModule,
    PresenceModule,
    StateModule
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
