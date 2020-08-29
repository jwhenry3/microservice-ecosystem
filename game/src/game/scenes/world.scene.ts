import { BaseScene }         from './base.scene';
import { loadCollisions }    from '../../lib/physics/loadCollisions';
import { PathfindingPlugin } from '../../lib/plugins/pathfinding';
import { Player }            from '../player';

export class WorldScene extends BaseScene {
  key = 'world';
  grid!: Phaser.GameObjects.Grid;
  walls!: Phaser.GameObjects.Group;
  pathfinding!: PathfindingPlugin;

  players: { [key: string]: Player } = {};
  myPlayer: Player | null            = null;

  preload() {
  }

  create() {
    super.create();
    this.pathfinding = new PathfindingPlugin();
    this.pathfinding.init({ key: this.key });
    let data = loadCollisions(this);
    if (data) {
      this.grid  = data.grid;
      this.walls = data.walls;
    }
  }

  resize() {
  }

  addPlayer(name: string, x: number, y: number, self: boolean = false) {
    this.players[name] = new Player(name, this, x, y, self);
    if (self) {
      if (this.myPlayer) {
        this.removePlayer(this.myPlayer.name);
      }
      this.myPlayer = this.players[name];
      this.cameras.main.startFollow(this.myPlayer);
      this.cameras.main.setZoom(1.5).setDeadzone(128, 128);
    }
  }

  removePlayer(name: string) {
    if (this.players[name]) {
      this.players[name].destroy(true);
      delete this.players[name];
      if (this.myPlayer?.name === name) {
        this.myPlayer = null;
      }
    }
  }

}
