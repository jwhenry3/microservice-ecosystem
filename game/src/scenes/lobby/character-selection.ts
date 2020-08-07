import { Lobby }     from './lobby';
import { Character } from '../../entities/mobs/character';

export class CharacterSelection extends Lobby {
  bg!: Phaser.GameObjects.Image;
  character!: Character;

  preload() {
    super.preload();
  }

  create() {
    super.create();
    this.bg.alpha  = 0.5;
    this.character = new Character(this, this.game.scale.canvasBounds.width / 2, this.game.scale.canvasBounds.height / 2);
    this.character.sprite.setAlpha(0.5);
    this.character.sprite.on('pointerover', () => {
      this.character.sprite.setAlpha(1);
    });
    this.character.sprite.on('pointerout', () => {
      this.character.sprite.setAlpha(0.5);
    });
    this.character.sprite.on('pointerdown', (pointer) => {
      this.scene.stop('character-selection');
      this.scene.start('world');
    });
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
  }
}
