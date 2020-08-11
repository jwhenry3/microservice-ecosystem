import { ReactNode }                     from 'react';
import { removeComponent, setComponent } from '../../ui-components';

export abstract class BaseScene extends Phaser.Scene {

  abstract key: string;

  init() {
    this.events.on('stop', () => {
      if (this.stop) {
        this.stop();
      }
      if (this.render) {
        removeComponent(this.key);
      }
    });
    this.events.on('resume', () => {
      if (this.resume) {
        this.resume();
      }
      if (this.start) {
        this.start();
      }
      if (this.render) {
        setComponent(this.key, this.render());
      }
    });
  }

  create() {
    if (this.start) {
      this.start();
    }
    if (this.render) {
      setComponent(this.key, this.render());
    }
  }

  render?: () => ReactNode;

  stop?: () => void;

  start?: () => void;

  resume?: () => void;
}
