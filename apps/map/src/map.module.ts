import { Module }        from '@nestjs/common';
import { ClientModule }  from '../../../lib/server/client.module';
import { ConfigModule }  from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path         from 'path';
import { MapController } from './map.controller';
import { MapService }    from './map.service';

export const MapEntities = [
  path.resolve(__dirname, 'entities/*.entity.js'),
];

@Module({
  imports    : [
    ConfigModule,
    TypeOrmModule.forFeature([]),
    ClientModule,
  ],
  providers  : [MapService],
  controllers: [MapController],
  exports    : [TypeOrmModule],
})
export class MapModule {

  static forRoot() {
    return {
      module : MapModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type       : 'mysql',
          host       : process.env.DB_HOST,
          port       : Number(process.env.DB_PORT),
          username   : process.env.DB_USERNAME,
          password   : process.env.DB_PASSWORD,
          database   : 'game',
          entities   : MapEntities,
          synchronize: true,
        }),
      ],
    };
  }
}
