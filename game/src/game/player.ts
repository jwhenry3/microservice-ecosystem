import { getColor }          from '../lib/physics/loadCollisions';
import { PathfindingPlugin } from '../lib/plugins/pathfinding';
import { CharacterMovement } from '../lib/physics/CharacterMovement';
import { WorldScene }        from './scenes/world.scene';

export class Player extends Phaser.GameObjects.Arc {
  movement: CharacterMovement;

  constructor(
    public id: number,
    public name: string,
    public pathfinding: PathfindingPlugin,
    public scene: WorldScene,
    x: number, y: number,
    public self: boolean       = false,
    public controller: boolean = false) {
    super(scene, x * 32 + 16, y * 32 + 16, 15, 0, 360, false, getColor('#4477ff'), 1);
    scene.add.existing(this);
    scene.physics.add.existing(this, false);
    (this.body as Phaser.Physics.Arcade.Body).setFriction(0, 0);
    this.movement = new CharacterMovement(this.scene, this.pathfinding, this);
  }

  update(...args): void {
    super.update(...args);
    this.movement.update();
  }

  toState() {
    return {
      id  : this.id,
      name: this.name,
      x   : Math.floor(this.x / 32),
      y   : Math.floor(this.y / 32),
      path: this.movement.path,
    };
  }
}
