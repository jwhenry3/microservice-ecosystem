import { Controller }  from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class StateController {
  constructor(private client: ClientProxy) {
  }
}
