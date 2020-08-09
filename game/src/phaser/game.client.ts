import Phaser                 from 'phaser';
import { Title }              from './scenes/lobby/title';
import { CharacterSelection } from './scenes/lobby/character-selection';
import { World }              from './scenes/world/world';
import { throttle }           from 'lodash';

export class GameClient {
  static game: Phaser.Game;

  static start() {
    this.game = new Phaser.Game({
      type     : Phaser.AUTO,
      banner   : false,
      autoFocus: true,
      input    : {
        queue  : true,
        gamepad: true,
      } as any,
      parent   : 'game-container',
      scale    : {
        mode: Phaser.Scale.RESIZE,
      },
    });
    this.game.scene.add('title', Title);
    this.game.scene.add('character-selection', CharacterSelection);
    this.game.scene.add('world', World);
    const listener = throttle(() => {
      this.game.scene.getScenes(true).forEach((scene) => scene.events.emit('resize'));
    }, 300, { trailing: true, leading: true });
    window.addEventListener('resize', listener);
    this.game.events.on('shutdown', () => {
      window.removeEventListener('resize', listener);
    });
    this.game.scene.start('title');
    setTimeout(() => {
      this.game.scene.getScenes(true).forEach((scene) => scene.events.emit('resize'));
    }, 300);
  }

  static goToScene(key: string, data?: any) {
    GameClient.game.scene.stop(key);
    let scenes = GameClient.game.scene.getScenes(true);
    for (let scene of scenes) {
      scene.scene.stop();
    }
    GameClient.game.scene.start(key, data);
  }

  static stop() {
    if (this.game) {
      this.game.destroy(true);
    }
  }
}
