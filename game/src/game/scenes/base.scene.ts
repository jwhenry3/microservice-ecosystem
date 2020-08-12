import { NetworkedGame } from '../networked.game';


export abstract class BaseScene extends Phaser.Scene {
  lifecycle: any;
  game!: NetworkedGame;
  abstract key: string;


  create() {
    this.events.on('stop', () => {
      if (this.stop) {
        this.stop();
      }
    });
    this.events.on('resume', () => {
      if (this.resume) {
        this.resume();
      }
      if (this.start) {
        this.start();
      }
    });
    if (this.start) {
      this.start();
    }
  }


  stop?: () => void;

  start?: () => void;

  resume?: () => void;
}
