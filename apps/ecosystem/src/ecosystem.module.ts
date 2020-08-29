import { Module }                         from '@nestjs/common';
import { AppService }                     from './app.service';
import { HealthController }               from './health/health.controller';
import { EventGateway }                   from './event/event.gateway';
import { EventController }                from './event/event.controller';
import { TerminusModule }                 from '@nestjs/terminus';
import { ConfigModule }                   from '@nestjs/config';
import { AccountEntities, AccountModule } from '../../account/src/account.module';
import { PresenceModule }                 from '../../presence/src/presence.module';
import { StateModule }                    from '../../state/src/state.module';
import { ClientModule }                   from '../../../lib/server/client.module';
import { TypeOrmModule }                  from '@nestjs/typeorm';
import { MapModule }                      from '../../map/src/map.module';
import { LocationEntity }                 from '../../map/src/entities/location.entity';


@Module({
  imports    : [
    ...(process.env.ALL_IN_ONE ? [
      AccountModule,
      PresenceModule.forRoot(),
      StateModule.forRoot(),
      MapModule,
    ] : []),
    ClientModule,
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type       : 'mysql',
      host       : process.env.DB_HOST,
      port       : Number(process.env.DB_PORT),
      username   : process.env.DB_USERNAME,
      password   : process.env.DB_PASSWORD,
      entities   : [
        ...(process.env.ALL_IN_ONE ? [...AccountEntities, LocationEntity] : [])
      ],
      database   : 'game',
      synchronize: true,
    }),
  ],
  controllers: [HealthController, EventController],
  providers  : [AppService, EventGateway],
})
export class EcosystemModule {
}
