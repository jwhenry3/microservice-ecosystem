import logoImg      from '../assets/logo.svg';
import bgImg        from '../assets/background.jpg';
import { throttle } from 'lodash';

export class Title extends Phaser.Scene {
  bg!: Phaser.GameObjects.Image;
  logo!: Phaser.GameObjects.Image;

  preload() {
    this.load.image('background', bgImg);
    this.load.svg('logo', logoImg, {
      width : 841.9,
      height: 595.3,
    });
  }

  create() {
    this.bg               = this.add.image(400, 300, 'background');
    this.bg.displayWidth  = 800;
    this.bg.displayHeight = 600;
    this.logo             = this.add.image(400, 400, 'logo');
    this.logo.setScale(0.5);
    let tween = this.tweens.add({
      targets : this.logo,
      y       : 200,
      duration: 2000,
      ease    : 'Power2',
      yoyo    : true,
      loop    : -1,
    });
    this.tweens.add({
      targets : this.logo,
      rotation: 2,
      loop    : -1,
    });
    let listener = throttle(() => {
      console.log('trigger');
        this.bg.displayWidth  = this.game.scale.canvasBounds.width;
        this.bg.displayHeight = this.game.scale.canvasBounds.height;
        this.bg.x             = this.bg.displayWidth / 2;
        this.bg.y             = this.bg.displayHeight / 2;
        this.logo.x           = this.game.scale.canvasBounds.width / 2;
        this.logo.y           = this.game.scale.canvasBounds.height / 2;
        tween.remove();
        tween = this.tweens.add({
          targets : this.logo,
          y       : this.game.scale.canvasBounds.height / 4,
          duration: 2000,
          ease    : 'Power2',
          yoyo    : true,
          loop    : -1,
        });
    }, 300, { trailing: true, leading: true });
    window.addEventListener('resize', listener);
    this.events.on('shutdown', () => {
      window.removeEventListener('resize', listener);
    });
    listener();
  }

}
