import { Controller }  from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private client: ClientProxy) {
  }
}
