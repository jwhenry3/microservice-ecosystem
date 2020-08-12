import { ReactNode }              from 'react';
import { removeComponent, setComponent } from '../../ui-components';
import { BaseScene }                     from './base.scene';

export abstract class BaseEntity extends Phaser.GameObjects.Container {
  key = 'test-entity';


  protected constructor(public scene: BaseScene, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]) {
    super(scene, x, y, children);
    scene.add.existing(this);
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
    if (this.stop) {
      this.stop();
    }
    if (this.render) {
      removeComponent(this.key);
    }
  }

  create() {
    this.scene.events.on('stop', () => {
      if (this.stop) {
        this.stop();
      }
      if (this.render) {
        removeComponent(this.key);
      }
    });
    this.scene.events.on('resume', () => {
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
    if (this.start) {
      this.start();
    }
    if (this.render) {
      setComponent(this.key, this.render());
    }
  }

  stop() {
  }

  start() {
  }

  resume() {
  }

  render?: () => ReactNode;
}
