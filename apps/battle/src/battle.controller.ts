import { Controller }  from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class BattleController {
  constructor(private client: ClientProxy) {
  }
}
