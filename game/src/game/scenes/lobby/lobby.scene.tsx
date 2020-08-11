import { BaseScene }                     from '../base.scene';
import React                             from 'react';
import Login                             from '../../Login';
import Modal                             from '../../../Modal';
import { addComponent, removeComponent } from '../../../ui-components';
import { BehaviorSubject }               from 'rxjs';
import Observe                           from '../../../lib/observe';


export class LobbyScene extends BaseScene {
  bg!: Phaser.GameObjects.Image;

  state = new BehaviorSubject({
    username: '',
    password: '',
  });

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
  }

  resize() {
    this.bg.setPosition(this.getSize().x / 2, this.getSize().y / 2);
    this.bg.displayWidth  = this.getSize().x;
    this.bg.displayHeight = this.getSize().y;
  }

  stop() {
    removeComponent('lobby');
  }

  start() {
    addComponent('lobby', this.render);
  }

  render = <Observe state={this.state} key="login">
    {(state) => (
      <Modal parent={document.getElementById('ui-center-center') as HTMLElement}>
        <Login data={state}/>
      </Modal>
    )}
  </Observe>;

  resume(): void {
  }
}
