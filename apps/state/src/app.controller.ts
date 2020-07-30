import { Controller, Inject } from '@nestjs/common';
import { ClientProxy }        from '@nestjs/microservices';
import { config }             from '../../../lib/config';

@Controller()
export class AppController {
  constructor(@Inject(config.serviceName) private client: ClientProxy) {
  }
}
