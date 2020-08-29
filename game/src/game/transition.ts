import { WorldScene } from './scenes/world.scene';
import { getColor }   from '../lib/physics/loadCollisions';

export class Transition extends Phaser.GameObjects.Rectangle {

  constructor(scene: WorldScene, public transition: { id: string, key: string, x: number, y: number }) {
    super(scene, transition.x * 32 + 16, transition.y * 32 + 16, 32, 32, getColor('#0ac'), 0.5);
    scene.add.existing(this);
  }
}
