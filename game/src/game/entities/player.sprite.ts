import { WorldScene } from '../scenes/world.scene';
import { getColor }   from '../../lib/physics/loadCollisions';
const Vector2 = Phaser.Math.Vector2;
export class PlayerSprite extends Phaser.GameObjects.Arc {
  body!: Phaser.Physics.Arcade.Body;

  constructor(
    public scene: WorldScene,
    x: number, y: number) {
    super(scene, x, y, 14, 0, 360, false, getColor('#4477ff'), 1);
    scene.add.existing(this);
    scene.physics.add.existing(this, false);
    this.body.setMaxVelocity(120, 120);
    this.body.useDamping = true;
    this.body.drag = new Vector2(0.5,0.5);
  }
}
