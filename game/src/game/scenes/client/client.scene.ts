import { WorldScene }        from '../world.scene';
import { CharacterMovement } from '../../../lib/physics/CharacterMovement';
import { NetworkedGame }     from '../../networked.game';

export class ClientScene extends WorldScene {
  game!: NetworkedGame;
  hasClicked = false;

  update(time: number, delta: number): void {
    super.update(time, delta);
    if (this.myPlayer) {
      let mouseDown = this.input.mousePointer.leftButtonDown();
      if (!this.hasClicked && mouseDown) {
        this.hasClicked = true;
        this.game.network.map.move(
          this.myPlayer.id,
          Math.round(this.input.activePointer.worldX / 32),
          Math.round(this.input.activePointer.worldY / 32),
        ).then(() => {
        });
      }
      if (!mouseDown) {
        this.hasClicked = false;
      }
    }
  }
}
