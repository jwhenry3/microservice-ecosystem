
import { WorldScene }        from '../scenes/world.scene';
import { getColor }          from '../../lib/physics/loadCollisions';

export class PlayerSprite extends Phaser.GameObjects.Arc {

  constructor(
    public scene: WorldScene,
    x: number, y: number) {
    super(scene, x * 32 + 16, y * 32 + 16, 15, 0, 360, false, getColor('#4477ff'), 1);
    scene.add.existing(this);
    scene.physics.add.existing(this, false);
    (this.body as Phaser.Physics.Arcade.Body).setFriction(0, 0);
  }
}
