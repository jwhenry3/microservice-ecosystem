import { ReactNode }                     from 'react';
import { removeComponent, setComponent } from '../../ui-components';
import { BaseScene }                     from '../scenes/base.scene';

export abstract class BaseEntity extends Phaser.GameObjects.Container {
  key = 'test-entity';


  protected constructor(public scene: BaseScene, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]) {
    super(scene, x, y, children);
    scene.add.existing(this);
  }

  removeUI() {
    if (this.render) {
      removeComponent(this.key);
    }
  }

  addUI() {
    if (this.render) {
      setComponent(this.key, this.render());
    }
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
    if (this.stop) {
      this.stop();
    }
    this.removeUI();
  }

  create() {
    this.scene.events.on('stop', () => {
      if (this.stop) {
        this.stop();
      }
      this.removeUI();
    });
    this.scene.events.on('resume', () => {
      if (this.resume) {
        this.resume();
      }
      if (this.start) {
        this.start();
      }
      this.addUI();
    });
    if (this.start) {
      this.start();
    }
    this.addUI();
  }

  stop() {
  }

  start() {
  }

  resume() {
  }

  render?: () => ReactNode;
}
