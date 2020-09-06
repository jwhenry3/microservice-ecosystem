import { WorldScene }         from '../world.scene';
import { NetworkedGame }      from '../../networked.game';
import { KeyboardController } from '../../keyboard.controller';
import { MouseController }    from '../../mouse.controller';

declare type Key = Phaser.Input.Keyboard.Key;

export class ClientScene extends WorldScene {
  game!: NetworkedGame;
  keyboardController = new KeyboardController();
  mouseController    = new MouseController();

  create() {
    super.create();
    this.keyboardController.initialize(this.input.keyboard);
  }


  update(time: number, delta: number): void {
    super.update(time, delta);
    this.mouseController.update(this);
  }

}
