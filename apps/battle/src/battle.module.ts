import '@geckos.io/phaser-on-nodejs';
import 'phaser';
import { Module }           from '@nestjs/common';
import { ClientModule }     from '../../../lib/server/client.module';
import { ConfigModule }     from '@nestjs/config';
import { TypeOrmModule }    from '@nestjs/typeorm';
import * as path            from 'path';
import { BattleController } from './battle.controller';
import { BattleService }    from './battle.service';

export const BattleEntities = [
  path.resolve(__dirname, 'entities/*.entity.js'),
];

@Module({
  imports    : [
    ConfigModule,
    TypeOrmModule.forFeature([]),
    ClientModule,
  ],
  providers  : [BattleService],
  controllers: [BattleController],
  exports    : [TypeOrmModule],
})
export class BattleModule {

  static forRoot() {
    return {
      module : BattleModule,
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
          entities   : BattleEntities,
          synchronize: true,
        }),
      ],
    };
  }
}
