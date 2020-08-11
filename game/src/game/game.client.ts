import Phaser              from 'phaser';
import { LoginScene }      from './scenes/lobby/login.scene';
import { CharactersScene } from './scenes/lobby/characters.scene';
import { CreateCharacterScene } from './scenes/lobby/create-character.scene';
import { FindGamesScene }       from './scenes/lobby/find-games.scene';
import { CreateGameScene }      from './scenes/lobby/create-game.scene';
import { JoinGameScene } from './scenes/lobby/join-game.scene';
import { LobbyScene }    from './scenes/lobby/lobby.scene';

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
    });
    this.game.scene.add('lobby', LobbyScene);
    this.game.scene.add('login', LoginScene);
    this.game.scene.add('characters', CharactersScene);
    this.game.scene.add('create-character', CreateCharacterScene);
    this.game.scene.add('create-game', CreateGameScene);
    this.game.scene.add('find-games', FindGamesScene);
    this.game.scene.add('join-game', JoinGameScene);
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
