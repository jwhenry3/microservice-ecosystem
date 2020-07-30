import { Module }        from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService }    from './app.service';
import { ClientModule }  from '../../../lib/client.module';

@Module({
  imports: [ClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class StateModule {}
