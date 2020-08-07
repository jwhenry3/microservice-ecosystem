import { Character } from './character';

export class LinkFourSwords implements Character {
  id = 'link-four-swords';
  speed = 2;
  sprite:Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, 'link-four-swords');
    this.sprite.displayWidth  = 38;
    this.sprite.displayHeight = 48;
    scene.physics?.add.existing(this.sprite);
    this.sprite.setInteractive();
  }
}
