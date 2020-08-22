import { BaseScene }         from '../base.scene';
import { loadCollisions }    from '../../../lib/physics/loadCollisions';
import { PathfindingPlugin } from '../../../lib/plugins/pathfinding';
import { CharacterMovement } from '../../../lib/physics/CharacterMovement';

export class WorldScene extends BaseScene {
  key = 'world';
  grid!: Phaser.GameObjects.Grid;
  player!: Phaser.GameObjects.Arc;
  walls!: Phaser.GameObjects.Group;
  pathfinding!: PathfindingPlugin;

  movement!: CharacterMovement;

  preload() {
  }

  create() {
    super.create();
    this.pathfinding = new PathfindingPlugin();
    this.pathfinding.init({ key: this.key });
    let data = loadCollisions(this);
    if (data) {
      this.grid     = data.grid;
      this.player   = data.player;
      this.walls    = data.walls;
      this.movement = new CharacterMovement(this, this.pathfinding, this.player);
    }
  }

  resize() {
  }

  hasClicked = false;

  update(time: number, delta: number): void {
    super.update(time, delta);
    if (this.movement) {
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

}
