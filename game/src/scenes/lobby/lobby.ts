export class Lobby extends Phaser.Scene {
  bg!: Phaser.GameObjects.Image;

  preload() {
    this.load.spritesheet('link-four-swords', '/assets/link.png', {
      frameWidth : 379,
      frameHeight: 484,
    });
    this.load.spritesheet('link-awakening', '/assets/link-2.png', {
      frameWidth : 840,
      frameHeight: 680,
    });
    this.load.spritesheet('link-nes', '/assets/link-3.png', {
      frameWidth : 300,
      frameHeight: 300,
    });
    this.load.image('background', '/assets/background.jpg');
    this.load.svg('logo', '/assets/logo.svg', {
      width : 841.9,
      height: 595.3,
    });
  }

  create() {
    this.bg = this.add.image(400, 300, 'background');
    this.setBackgroundSize();
    this.events.on('resize', () => {
      this.setBackgroundSize();
    });
  }

  private setBackgroundSize() {
    this.bg.displayWidth  = this.game.scale.canvasBounds.width;
    this.bg.displayHeight = this.game.scale.canvasBounds.height;
    this.bg.x             = Math.round(this.bg.displayWidth / 2);
    this.bg.y             = Math.round(this.bg.displayHeight / 2);
  }
}
