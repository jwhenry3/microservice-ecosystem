export class LobbyScene extends Phaser.Scene {
  bg!: Phaser.GameObjects.Image;

  preload() {
    this.load.image('background', '/assets/background.jpg');
  }

  getSize() {
    return { x: this.scale.canvas.offsetWidth, y: this.scale.canvas.offsetHeight };
  }

  create() {
    this.bg               = this.add.image(this.getSize().x / 2, this.getSize().y / 2, 'background');
    this.bg.displayWidth  = this.getSize().x;
    this.bg.displayHeight = this.getSize().y;
  }

  resize() {
    this.bg.setPosition(this.getSize().x / 2, this.getSize().y / 2);
    this.bg.displayWidth  = this.getSize().x;
    this.bg.displayHeight = this.getSize().y;
  }
}
