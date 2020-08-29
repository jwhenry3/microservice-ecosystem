import { WorldScene }        from '../world.scene';
import { CharacterMovement } from '../../../lib/physics/CharacterMovement';

export class ClientScene extends WorldScene {
  movement!: CharacterMovement;
  hasClicked = false;

  update(time: number, delta: number): void {
    super.update(time, delta);
    if (this.myPlayer) {
      let mouseDown = this.input.mousePointer.leftButtonDown();
      if (!this.hasClicked && mouseDown) {
        this.hasClicked = true;
        this.movement.findPath();
      }
      if (!mouseDown) {
        this.hasClicked = false;
      }
      this.movement.update();
    }
  }

  addPlayer(id: number, name: string, x: number, y: number, self: boolean = false) {
    super.addPlayer(id, name, x, y, self);
    console.log(self, this.myPlayer);
    if (self && this.myPlayer) {
      this.movement = new CharacterMovement(this, this.pathfinding, this.myPlayer);
    }
  }
}
