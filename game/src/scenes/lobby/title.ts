import { Lobby } from './lobby';

export class Title extends Lobby {
  bg!: Phaser.GameObjects.Image;
  logo!: Phaser.GameObjects.Image;


  create() {
    super.create();
    this.logo = this.add.image(this.game.scale.canvasBounds.width / 2, this.game.scale.canvasBounds.height / 2, 'logo');
    this.logo.setScale(0.5);
    this.tweens.add({
      targets: this.logo,
      rotate: Math.PI,
      loop: -1
    });

    this.events.on('resize', () => {
      this.logo.x = Math.round(this.game.scale.canvasBounds.width / 2);
      this.logo.y = Math.round(this.game.scale.canvasBounds.height / 2);
    });
    setTimeout(() => {
      this.scene.stop('title');
      this.scene.start('character-selection');
    }, 3000);
  }

}
