import { Controller }     from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ClientController {

  @MessagePattern('health.' + process.env.SERVICE_NAME)
  health() {
    return 'up';
  }
}
