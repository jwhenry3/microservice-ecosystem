import { Character } from './character';

export class LinkNes implements Character {
  id    = 'link-nes';
  speed = 2;
  sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite               = scene.add.sprite(x, y, 'link-nes');
    this.sprite.displayWidth  = 52;
    this.sprite.displayHeight = 52;
    scene.physics?.add.existing(this.sprite);
    this.sprite.setInteractive();
  }
}
