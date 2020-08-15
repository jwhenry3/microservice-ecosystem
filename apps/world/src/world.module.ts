import { Module }            from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountRepo }       from './account.repo';
import { ClientModule }      from '../../../lib/server/client.module';
import { ConfigModule }      from '@nestjs/config';
import { TypeOrmModule }     from '@nestjs/typeorm';
import * as path             from 'path';

export const WorldEntities = [
  path.resolve(__dirname, 'entities/*.entity.js'),
];

@Module({
  imports    : [
    ConfigModule,
    TypeOrmModule.forFeature([]),
    ClientModule,
  ],
  providers  : [],
  controllers: [],
  exports    : [TypeOrmModule],
})
export class WorldModule {

  static forRoot() {
    return {
      module : WorldModule,
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
          entities   : WorldEntities,
          synchronize: true,
        }),
      ],
    };
  }
}
