import { Module }         from '@nestjs/common';
import { AppController }  from './app.controller';
import { AccountService } from './account.service';
import { ClientModule }   from '../../../lib/server/client.module';
import { ConfigModule }   from '@nestjs/config';
import { TypeOrmModule }  from '@nestjs/typeorm';
import * as path          from 'path';

export const AccountEntities = [
  path.resolve(__dirname, 'entities/*.entity.js'),
];

@Module({
  imports    : [
    ConfigModule,
    TypeOrmModule.forFeature([AccountService]),
    ClientModule,
  ],
  controllers: [AppController],
  exports    : [TypeOrmModule],
})
export class AccountModule {

  static forRoot() {
    return {
      module : AccountModule,
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
          entities   : AccountEntities,
          synchronize: true,
        }),
      ],
    };
  }
}
