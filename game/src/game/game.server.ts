import { GameMap }   from './server/game.map';
import { getColor }  from '../lib/physics/loadCollisions';
import { BaseScene } from './scenes/base.scene';
import { throttle }  from 'lodash';

export class GameServerScene extends BaseScene {
  key = 'test';

  create() {
    let circle = this.add.circle(100, 100, 32, getColor('#777'));
  }

  resize() {
    let bounds                          = this.game.scale.canvas.getBoundingClientRect();
    this.game.scale.canvasBounds.width  = bounds.width;
    this.game.scale.canvasBounds.height = bounds.height;
    console.log(bounds);
  }
}

export class GameServer {

  maps: { [key: string]: GameMap } = {};
  container: HTMLDivElement        = document.getElementById('game-server') as HTMLDivElement;

  constructor() {
    this.maps['test 1'] = new GameMap('test 1', this.container, GameServerScene);
    this.maps['test 2'] = new GameMap('test 2', this.container, GameServerScene);
    this.maps['test 3'] = new GameMap('test 3', this.container, GameServerScene);
    this.maps['test 4'] = new GameMap('test 4', this.container, GameServerScene);
    this.maps['test 5'] = new GameMap('test 5', this.container, GameServerScene);
    this.maps['test 6'] = new GameMap('test 6', this.container, GameServerScene);
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
