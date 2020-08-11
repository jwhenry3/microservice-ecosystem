import { BaseScene }                     from '../base.scene';
import React, { ReactNode }              from 'react';
import Login                             from '../../Login';
import Modal                             from '../../../Modal';
import { addComponent, removeComponent } from '../../../ui-components';


export class LobbyScene extends BaseScene {
  bg!: Phaser.GameObjects.Image;

  login: ReactNode;


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
    setTimeout(() => {
      this.stop();
    }, 3000);
  }

  resize() {
    this.bg.setPosition(this.getSize().x / 2, this.getSize().y / 2);
    this.bg.displayWidth  = this.getSize().x;
    this.bg.displayHeight = this.getSize().y;
  }

  stop() {
    console.log('Stopped!');
    removeComponent('login');
  }

  start() {
    console.log('Started!');
    this.login = <Modal key="login" parent={document.getElementById('ui-center-center') as HTMLElement}>
      <Login/>
    </Modal>;
    addComponent('login', this.login);
  }

  resume(): void {
  }
}
