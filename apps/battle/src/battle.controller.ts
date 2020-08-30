import { Controller }    from '@nestjs/common';
import { ClientProxy }   from '@nestjs/microservices';
import { BattleService } from './battle.service';

@Controller()
export class BattleController {
  constructor(private client: ClientProxy, private service: BattleService) {
  }
}
