import Phaser            from 'phaser';
import { LobbyScene }    from './scenes/client/lobby/lobby.scene';
import { NetworkedGame } from './networked.game';
import { throttle }      from 'lodash';
import { Zone1Scene }    from './scenes/client/world/zone-1.scene';
import { WorldScene }    from './scenes/world.scene';

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
      physics  : {
        default: 'arcade',
        arcade : {
          gravity: {
            x: 0,
            y: 0,
          },
        },
      },
      canvas   : document.getElementById('game-canvas') as HTMLCanvasElement,
      scale    : {
        mode: Phaser.Scale.RESIZE,
      },
    });
    this.game.network.net.on('connect', () => {
      if (this.game.network.auth.session.token) {
        this.game.network.auth.verify().then(() => {
          this.game.network.net.reconnect.next();
        });
      }
    });

    this.game.scene.add('lobby', LobbyScene);
    this.game.scene.add('zone-1', Zone1Scene);
    window.addEventListener('resize', throttle(() => {
      this.game.scene.getScenes(true).forEach(scene => {
        if (typeof scene['resize'] === 'function') {
          scene['resize']();
        }
      });
    }, 300, { leading: true, trailing: true }));
    this.game.scene.start('lobby');
    this.game.network.map.onUpdate((state) => {
      console.log('state!', state);
      let scene = this.game.scene.getScene(state.map) as WorldScene;
      if (scene) {
        for (let player of state.players) {
          let clientPlayer = scene.playerById[player.id];
          if (!clientPlayer) {
            scene.addPlayer(player.id, player.name, player.x, player.y, player.id === this.game.network.character.currentId);
            clientPlayer = scene.playerById[player.id];
          }
          if (!player.path) {
            player.path = [{ x: player.x, y: player.y }];
          }
          clientPlayer.movement.path = player.path || [];
        }
      }
    });
  }
}
