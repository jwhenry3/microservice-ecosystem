import { WorldScene }                from '../world.scene';
import { CharacterMovement }         from '../../../lib/physics/CharacterMovement';
import { NetworkedGame }             from '../../networked.game';
import { availableKeys, KeyMapping } from '../../key.mapping';

declare type Key = Phaser.Input.Keyboard.Key;

export class ClientScene extends WorldScene {
  game!: NetworkedGame;
  hasClicked = false;

  keys: { [key: string]: Phaser.Input.Keyboard.Key } = {};

  mapping = new KeyMapping();

  create() {
    super.create();
    for (let key of availableKeys) {
      let replaced = key;
      if (key === ' ') {
        replaced = 'space';
      }
      this.keys[key] = this.input.keyboard.addKey(replaced);
      this.keys[key].on('up', () => {
        this.keysDown.splice(this.keysDown.indexOf(key), 1);
        if (this.keys[key].duration < 500) {
          // console.log(replaced, 'press', this.mapping.get(key));
        }
      });
      this.keys[key].on('down', () => {
        this.keysDown.push(key);
        console.log('use action', key, this.mapping.get(key));
      });
    }
  }

  keysDown: string[] = [];

  update(time: number, delta: number): void {
    super.update(time, delta);
    if (this.myPlayer) {
      let mouseDown = this.input.mousePointer.leftButtonDown();
      if (!this.hasClicked && mouseDown) {
        this.hasClicked = true;
        this.game.network.map.move(
          this.myPlayer.id,
          Math.round(this.input.activePointer.worldX / 32),
          Math.round(this.input.activePointer.worldY / 32),
        ).then(() => {
        });
      }
      if (!mouseDown) {
        this.hasClicked = false;
      }
    }
  }

}
