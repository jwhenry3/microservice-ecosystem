import { ServerScene } from '../server.scene';

export class Zone1Scene extends ServerScene {
  key = 'zone-1';

  create() {
    super.create();
    this.addPlayer('me', 10, 10, false);
  }
}
