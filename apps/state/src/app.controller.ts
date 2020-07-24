import { Controller, Inject } from '@nestjs/common';
import { ClientProxy }        from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(@Inject('STATE_SERVICE') private client: ClientProxy) {
  }
}
