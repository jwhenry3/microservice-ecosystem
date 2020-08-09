import { LinkFourSwords } from '../../../entities/mobs/linkFourSwords';
import { Character }      from '../../../entities/mobs/character';
import { LinkAwakening }  from '../../../entities/mobs/linkAwakening';
import { LinkNes }        from '../../../entities/mobs/linkNes';
import { SocketClient }   from '../../../connection/socketClient';
import { Keyboard }       from '../../../controls/keyboard';
import { GamePad }        from '../../../controls/game-pad';
import { Controls }       from '../../../controls/controls';

export class World extends Phaser.Scene {
  character!: Character;
  selectedCharacter!: string;
  keyboard!: Keyboard;
  gamepad!: GamePad;

  characters = {
    'link-awakening'  : LinkAwakening,
    'link-four-swords': LinkFourSwords,
    'link-nes'        : LinkNes,
  };

  init(data) {
    this.selectedCharacter = data.character;
  }

  preload() {
    this.load.spritesheet('link-four-swords', '/assets/link.png', {
      frameWidth : 379,
      frameHeight: 484,
    });
    this.load.spritesheet('link-awakening', '/assets/link-2.png', {
      frameWidth : 840,
      frameHeight: 680,
    });
    this.load.spritesheet('link-nes', '/assets/link-3.png', {
      frameWidth : 300,
      frameHeight: 300,
    });
  }

  create() {
    this.keyboard  = new Keyboard(this);
    this.gamepad   = new GamePad(this);
    this.character = new (this.characters[this.selectedCharacter])(this, this.game.scale.canvasBounds.width / 2, this.game.scale.canvasBounds.height / 2);
    console.log(this.character);
    this.events.on('shutdown', () => {
      this.input.keyboard.removeAllKeys();
    });
    console.log('loaded!');
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    if (SocketClient.socket.connected) {

      let x = 0;
      let y = 0;
      let controls:Controls = {
        up() {
          y--;
        },
        down() {
          y++;
        },
        left() {
          x--;
        },
        right() {
          x++;
        },
      };
      this.gamepad.handle(controls);
      this.keyboard.handle(controls);
      this.character.sprite.setPosition(this.character.sprite.x + (x * this.character.speed), this.character.sprite.y + (y * this.character.speed));
    }
  }
}
