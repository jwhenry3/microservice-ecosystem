import { Character } from './character';

export class LinkAwakening implements Character {
  id = 'link-awakening';
  speed = 2;
  sprite:Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, 'link-awakening');
    this.sprite.displayWidth  = 60;
    this.sprite.displayHeight = 48;
    scene.physics?.add.existing(this.sprite);
    this.sprite.setInteractive();
  }
}
