export class Character {
  speed = 2;
  sprite:Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, 'character');
    this.sprite.displayWidth  = 38;
    this.sprite.displayHeight = 48;
    scene.physics?.add.existing(this.sprite);
    this.sprite.setInteractive();
  }
}
