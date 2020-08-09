import { Controls } from './controls';

export class GamePad {
  enabled = true;

  constructor(private scene: Phaser.Scene) {
  }

  handle(controls: Controls) {
    if (this.enabled && this.scene.input.gamepad?.enabled) {
      let normalized = {
        x: Math.round(this.scene.input.gamepad?.pad1?.leftStick?.x),
        y: Math.round(this.scene.input.gamepad?.pad1?.leftStick?.y)
      };
      if (normalized.x > 0) {
        controls.right();
      } else if (normalized.x < 0) {
        controls.left();
      }
      if (normalized.y > 0) {
        controls.down();
      } else if (normalized.y < 0) {
        controls.up();
      }
    }
  }
}
