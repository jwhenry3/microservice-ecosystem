import { Network } from './network';

export class NetworkedGame extends Phaser.Game {
  network!: Network;


  protected start(): void {
    super.start();
    this.network = new Network();
  }
}
