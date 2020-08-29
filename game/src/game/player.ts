import { getColor } from '../lib/physics/loadCollisions';

export class Player extends Phaser.GameObjects.Arc {
  constructor(public name: string, scene: Phaser.Scene, x: number, y: number, public self: boolean = false, public controller: boolean = false) {
    super(scene, x * 32 + 16, y * 32 + 16, 15, 0, 360, false, getColor('#4477ff'));
    scene.add.existing(this);
    scene.physics.add.existing(this, false);
    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true).setFriction(0, 0);
  }
}
