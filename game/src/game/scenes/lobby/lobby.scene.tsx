import { BaseScene }      from '../base.scene';
import React           from 'react';
import { LoginEntity } from './login.entity';


export class LobbyScene extends BaseScene {
  key = 'lobby';
  bg!: Phaser.GameObjects.Image;

  login!: LoginEntity;

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
    this.login            = new LoginEntity(this);
    this.lifecycle.add(this.login);
    setTimeout(() => {
      this.scene.stop();
      setTimeout(() => {
        this.scene.restart();
      }, 5 * 1000);
    }, 5 * 1000);
  }

  resize() {
    this.bg.setPosition(this.getSize().x / 2, this.getSize().y / 2);
    this.bg.displayWidth  = this.getSize().x;
    this.bg.displayHeight = this.getSize().y;
  }
}
