import { Module }          from '@nestjs/common';
import { StateController } from './state.controller';
import { AppService }      from './app.service';
import { ClientModule } from '../../../lib/server/client.module';

@Module({
  imports    : [],
  controllers: [StateController],
  providers  : [AppService],
})
export class StateModule {
  static forRoot() {
    return {
      module : StateModule,
      imports: [
        ClientModule,
      ],
    };
  }
}
