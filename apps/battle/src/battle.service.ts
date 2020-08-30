import { Injectable } from '@nestjs/common';

@Injectable()
export class BattleService {
  getHello(): string {
    return 'Hello World!';
  }
}
