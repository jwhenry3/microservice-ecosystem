import { Network } from './network';

export class NetworkedGame extends Phaser.Game {
  network!: Network;

  constructor(config?: Phaser.Types.Core.GameConfig) {
    super(config);
    this.network = new Network();
  }
}
