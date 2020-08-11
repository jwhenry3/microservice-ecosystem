import Phaser                from 'phaser';
import { LobbyScene }        from './scenes/lobby/lobby.scene';
import PhaserLifecyclePlugin from 'phaser-lifecycle-plugin';

export class GameClient {
  game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game({
      type     : Phaser.CANVAS,
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
      plugins  : {
        scene: [
          {
            plugin : PhaserLifecyclePlugin,
            key    : 'lifecycle',
            mapping: 'lifecycle',
          },
        ],
      },
    });
    this.game.scene.add('lobby', LobbyScene);
    window.addEventListener('resize', () => {
      this.game.scene.getScenes(true).forEach(scene => {
        if (typeof scene['resize'] === 'function') {
          scene['resize']();
        }
      });
    });
    this.game.scene.start('lobby');
  }
}
