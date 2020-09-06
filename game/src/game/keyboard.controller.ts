import { availableKeys, KeyMapping } from './key.mapping';

declare type KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;

export class KeyboardController extends KeyMapping {

  keys: { [key: string]: Phaser.Input.Keyboard.Key } = {};
  keysDown: string[]                                 = [];

  initialize(keyboard: KeyboardPlugin) {
    for (let key of availableKeys) {
      let replaced = key;
      if (key === ' ') {
        replaced = 'space';
      }
      this.keys[key] = keyboard.addKey(replaced);
      this.keys[key].on('up', () => {
        this.keysDown.splice(this.keysDown.indexOf(key), 1);
        if (this.keys[key].duration < 500) {
          // console.log(replaced, 'press', this.mapping.get(key));
        }
      });
      this.keys[key].on('down', () => {
        this.keysDown.push(key);
        console.log('use action', key, this.getMapping(key));
      });
    }
  }
}
