import Phaser         from 'phaser';
import { LobbyScene } from './scenes/lobby/lobby.scene';

export class GameClient {
  static game: Phaser.Game;

  static start() {
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
