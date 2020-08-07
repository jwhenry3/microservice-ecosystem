export class Character extends Phaser.GameObjects.Sprite {
  speed = 2;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'character');
    this.width = 38;
    this.height = 48;
    this.displayWidth = 38;
    this.displayHeight = 48;
    scene.add.existing(this);
    scene.physics?.add.existing(this);
    if (this.body) {
    }
  }
}
