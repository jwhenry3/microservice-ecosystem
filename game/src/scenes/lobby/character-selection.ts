import { Lobby }     from './lobby';
import { Character } from '../../entities/mobs/character';

export class CharacterSelection extends Lobby {
  bg!: Phaser.GameObjects.Image;
  character!: Character;

  up!: Phaser.Input.Keyboard.Key;
  down!: Phaser.Input.Keyboard.Key;
  left!: Phaser.Input.Keyboard.Key;
  right!: Phaser.Input.Keyboard.Key;

  preload() {
    super.preload();
  }

  create() {
    super.create();
    this.bg.alpha  = 0.5;
    this.character = new Character(this, this.game.scale.canvasBounds.width / 2, this.game.scale.canvasBounds.height / 2);
    this.up        = this.input.keyboard.addKey('W');
    this.down      = this.input.keyboard.addKey('S');
    this.left      = this.input.keyboard.addKey('A');
    this.right     = this.input.keyboard.addKey('D');
    this.events.on('shutdown', () => {
      this.input.keyboard.removeAllKeys();
    })
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    let x = Number(this.input.keyboard.checkDown(this.right)) + Number(-this.input.keyboard.checkDown(this.left));
    let y = Number(this.input.keyboard.checkDown(this.down)) + Number(-this.input.keyboard.checkDown(this.up));
    this.character.setPosition(this.character.x + (x * this.character.speed), this.character.y + (y * this.character.speed));
  }
}
