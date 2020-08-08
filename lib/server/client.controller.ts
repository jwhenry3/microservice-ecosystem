import { Controller }     from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { config }         from '../config';

@Controller()
export class ClientController {

  @MessagePattern('health.' + config.serviceName)
  health() {
    return 'up';
  }
}
