import { BaseScene }                from './base.scene';
import { getColor, loadCollisions } from '../../lib/physics/loadCollisions';
import { PathfindingPlugin }        from '../../lib/plugins/pathfinding';
import { Player }                   from '../player';
import { Transition }               from '../transition';
import { KeyboardController }       from '../keyboard.controller';
import { MouseController }          from '../mouse.controller';
import { NetworkedGame }            from '../networked.game';

export class WorldScene extends BaseScene {
  game!: NetworkedGame;
  key                = 'world';
  grid!: Phaser.GameObjects.Grid;
  wallGroup!: Phaser.GameObjects.Group;
  transitionGroup!: Phaser.GameObjects.Group;
  playerGroup!: Phaser.GameObjects.Group;
  pathfinding!: PathfindingPlugin;
  keyboardController = new KeyboardController();
  mouseController    = new MouseController();

  transitions: { x: number, y: number, key: string, id: string }[] = [{
    x  : 2,
    y  : 2,
    key: 'zone-2',
    id : 'zone-1-zone-2',
  }];

  players: { [key: string]: Player }   = {};
  playerById: { [id: number]: Player } = {};
  playerArray: string[]                = [];
  myPlayer: Player | null              = null;

  preload() {
  }

  create() {
    super.create();
    this.playerGroup = this.add.group();
    if (this.playerArray.length) {
      this.playerGroup.addMultiple(this.playerArray.map(id => this.playerById[id].sprite));
    }
    this.pathfinding = new PathfindingPlugin();
    this.pathfinding.init({ key: this.key });
    let data = loadCollisions(this);
    if (data) {
      this.grid      = data.grid;
      this.wallGroup = data.walls;
    }
    this.transitionGroup = this.add.group();
    for (let transition of this.transitions) {
      let square = new Transition(this, transition);
      this.transitionGroup.add(square);
      this.physics.add.existing(square, true);
    }
    this.keyboardController.initialize(this.input.keyboard);
  }

  resize() {
  }

  addPlayer(id: number, name: string, x: number, y: number, self: boolean = false) {
    if (this.players[name]) {
      this.removePlayer(name);
    }
    this.players[name]  = new Player(id, name, this.pathfinding, this, x, y, self);
    this.playerById[id] = this.players[name];
    if (this.playerGroup) {
      this.playerGroup.add(this.players[name].sprite);
    }
    if (self) {
      this.myPlayer = this.players[name];
      this.cameras.main.startFollow(this.myPlayer.sprite);
      this.cameras.main.setZoom(1.5).setDeadzone(128, 128);
    }
    this.playerArray = Object.keys(this.playerById);
  }

  removePlayer(name: string) {
    if (this.players[name]) {
      if (this.playerGroup) {
        this.playerGroup.remove(this.players[name].sprite);
      }
      this.players[name].sprite.destroy(true);
      delete this.playerById[this.players[name].id];
      delete this.players[name];
      if (this.myPlayer?.name === name) {
        this.myPlayer = null;
      }
      this.playerArray = Object.keys(this.playerById);
    }
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    this.physics.overlap(this.playerGroup, this.transitionGroup, (obj1, obj2) => {
      console.log('collide!');
    });
    this.playerArray.forEach(id => this.playerById[id].update(time, delta));
    this.mouseController.update(this);
  }

}
