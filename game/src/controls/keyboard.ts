import { Controls } from './controls';

export class Keyboard {


  up!: Phaser.Input.Keyboard.Key;
  down!: Phaser.Input.Keyboard.Key;
  left!: Phaser.Input.Keyboard.Key;
  right!: Phaser.Input.Keyboard.Key;

  enabled = true;

  constructor(private scene: Phaser.Scene) {
    this.up    = this.scene.input.keyboard.addKey('W');
    this.down  = this.scene.input.keyboard.addKey('S');
    this.left  = this.scene.input.keyboard.addKey('A');
    this.right = this.scene.input.keyboard.addKey('D');
  }

  handle(controls: Controls) {
    if (this.enabled) {
      if (this.scene.input.keyboard.checkDown(this.right)) {
        controls.right();
      }
      if (this.scene.input.keyboard.checkDown(this.left)) {
        controls.left();
      }
      if (this.scene.input.keyboard.checkDown(this.down)) {
        controls.down();
      }
      if (this.scene.input.keyboard.checkDown(this.up)) {
        controls.up();
      }
    }
  }
}
