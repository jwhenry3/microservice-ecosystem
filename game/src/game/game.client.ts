import Phaser            from 'phaser';
import { LobbyScene }    from './scenes/lobby/lobby.scene';
import { NetworkedGame } from './networked.game';
import { throttle }      from 'lodash';

export class GameClient {
  static game: NetworkedGame;

  static start() {
    this.game = new NetworkedGame({
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
    });

    this.game.scene.add('lobby', LobbyScene);
    window.addEventListener('resize', throttle(() => {
      this.game.scene.getScenes(true).forEach(scene => {
        if (typeof scene['resize'] === 'function') {
          scene['resize']();
        }
      });
    }, 300, {leading: true,trailing: true}));
    this.game.scene.start('lobby');
  }
}
