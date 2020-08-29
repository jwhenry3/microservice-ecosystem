import { GameMap }  from './scenes/server/game.map';
import { throttle } from 'lodash';
import { Zone1Scene } from './scenes/server/world/zone-1.scene';

export class GameServer {

  maps: { [key: string]: GameMap } = {};
  container: HTMLDivElement        = document.getElementById('game-server') as HTMLDivElement;

  constructor() {
    this.maps['zone-1'] = new GameMap('test 1', this.container, Zone1Scene);
    window.addEventListener('resize', throttle(() => {
      Object.keys(this.maps).forEach((key) => {
        let map = this.maps[key];
        map.game.scene.getScenes(true).forEach(scene => {
          if (typeof scene['resize'] === 'function') {
            scene['resize']();
          }
        });
      });
    }, 300, { leading: true, trailing: true }));
  }
}
