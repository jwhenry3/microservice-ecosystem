import { BaseScene }                from './base.scene';
import { getColor, loadCollisions } from '../../lib/physics/loadCollisions';
import { PathfindingPlugin }        from '../../lib/plugins/pathfinding';
import { Player }                   from '../player';
import { Transition }               from '../transition';
import { KeyboardController }       from '../keyboard.controller';
import { MouseController }          from '../mouse.controller';
import { NetworkedGame }            from '../networked.game';
import { BehaviorSubject }          from 'rxjs';
import { filter, first }            from 'rxjs/operators';

export class WorldScene extends BaseScene {
  game!: NetworkedGame;
  key                = 'world';
  playerGroup!: Phaser.GameObjects.Group;
  keyboardController = new KeyboardController();
  mouseController    = new MouseController();

  players: { [key: string]: Player }   = {};
  playerById: { [id: number]: Player } = {};
  playerArray: string[]                = [];
  myPlayer: Player | null              = null;

  hasCreated = false;


  create() {
    this.hasCreated = false;
    super.create();
    this.playerGroup = this.add.group();
    if (this.playerArray.length) {
      this.playerGroup.addMultiple(this.playerArray.map(id => this.playerById[id].sprite));
    }
    this.keyboardController.initialize(this.input.keyboard);
    this.hasCreated = true;
  }

  resize() {
  }

  addPlayer(id: number, name: string, x: number, y: number, self: boolean = false) {
    if (this.hasCreated) {
      if (this.players[name]) {
        this.removePlayer(name);
      }
      this.players[name]  = new Player(id, name, this, x, y, self);
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
    this.playerArray.forEach(id => this.playerById[id].update(time, delta));
    this.mouseController.update(this);
  }

}
