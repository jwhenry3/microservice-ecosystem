import { Character } from '../../entities/mobs/character';

export class World extends Phaser.Scene {
  character!: Character;

  up!: Phaser.Input.Keyboard.Key;
  down!: Phaser.Input.Keyboard.Key;
  left!: Phaser.Input.Keyboard.Key;
  right!: Phaser.Input.Keyboard.Key;

  preload() {
    this.load.spritesheet('character', '/assets/link.png', {
      frameWidth : 379,
      frameHeight: 484,
    });
  }

  create() {
    this.character = new Character(this, this.game.scale.canvasBounds.width / 2, this.game.scale.canvasBounds.height / 2);
    this.up        = this.input.keyboard.addKey('W');
    this.down      = this.input.keyboard.addKey('S');
    this.left      = this.input.keyboard.addKey('A');
    this.right     = this.input.keyboard.addKey('D');
    this.events.on('shutdown', () => {
      this.input.keyboard.removeAllKeys();
    });
    console.log('loaded!');
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    let x = Number(this.input.keyboard.checkDown(this.right)) + Number(-this.input.keyboard.checkDown(this.left));
    let y = Number(this.input.keyboard.checkDown(this.down)) + Number(-this.input.keyboard.checkDown(this.up));
    this.character.sprite.setPosition(this.character.sprite.x + (x * this.character.speed), this.character.sprite.y + (y * this.character.speed));
  }
}
