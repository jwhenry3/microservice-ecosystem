import { Lobby }          from './lobby';
import { LinkFourSwords } from '../../../entities/mobs/linkFourSwords';
import { LinkAwakening }  from '../../../entities/mobs/linkAwakening';
import { LinkNes }        from '../../../entities/mobs/linkNes';
import { Character }      from '../../../entities/mobs/character';
import { SocketClient }   from '../../../connection/socketClient';

export class CharacterSelection extends Lobby {
  bg!: Phaser.GameObjects.Image;
  characters: Character[] = [];

  preload() {
    super.preload();
  }

  create() {
    super.create();
    this.bg.alpha   = 0.5;
    this.characters = [
      new LinkFourSwords(this, (this.game.scale.canvasBounds.width / 2) - 120, this.game.scale.canvasBounds.height / 2),
      new LinkAwakening(this, this.game.scale.canvasBounds.width / 2, this.game.scale.canvasBounds.height / 2),
      new LinkNes(this, (this.game.scale.canvasBounds.width / 2) + 120, this.game.scale.canvasBounds.height / 2),
    ];
    for (let character of this.characters) {
      this.configureCharacter(character);
    }
  }

  configureCharacter(character: Character) {
    character.sprite.setAlpha(0.5);
    character.sprite.on('pointerover', () => {
      character.sprite.setAlpha(1);
    });
    character.sprite.on('pointerout', () => {
      character.sprite.setAlpha(0.5);
    });
    character.sprite.on('pointerdown', (pointer) => {
      this.scene.stop('character-selection');
      this.scene.start('world', { character: character.id });
      SocketClient.character = {
        id    : 1,
        name  : 'Test',
        sprite: character.id,
      };
    });
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
  }
}
