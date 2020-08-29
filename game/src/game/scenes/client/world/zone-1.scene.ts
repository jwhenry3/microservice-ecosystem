import { WorldScene }  from '../../world.scene';
import { ClientScene } from '../client.scene';

export class Zone1Scene extends ClientScene {
  key = 'zone-1';

  create() {
    super.create();
    this.addPlayer('me', 10,10, true);
  }
}
