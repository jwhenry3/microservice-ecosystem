import { BaseScene }     from '../base.scene';
import { LobbyUI }       from './ui/lobby.ui';
import { NetworkedGame } from '../../networked.game';

export class LobbyScene extends BaseScene {
  key = 'lobby';
  bg!: Phaser.GameObjects.Image;
  game!: NetworkedGame;

  login!: LobbyUI;

  preload() {
    this.load.image('background', '/assets/background.jpg');
  }

  getSize() {
    return { x: this.scale.canvas.offsetWidth, y: this.scale.canvas.offsetHeight };
  }

  create() {
    super.create();
    this.bg               = this.add.image(this.getSize().x / 2, this.getSize().y / 2, 'background');
    this.bg.displayWidth  = this.getSize().x;
    this.bg.displayHeight = this.getSize().y;
    this.login            = new LobbyUI(this);
  }

  resize() {
    this.bg.setPosition(this.getSize().x / 2, this.getSize().y / 2);
    this.bg.displayWidth  = this.getSize().x;
    this.bg.displayHeight = this.getSize().y;
  }
}
