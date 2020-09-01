import Phaser          from 'phaser';
import { ServerScene } from './server.scene';

export interface PlayerState {
  id: number
  name: string
  x: number
  y: number
  path: [number, number][]
}

export interface MapState {
  map: string
  players: PlayerState[]
}

const FPS = 30;
// Create as many of these as needed to serve as map servers.
// Running this in the browser may allow for multiple instances of phaser or scenes
export class GameMap {

  game: Phaser.Game;
  scene: ServerScene;

  state: MapState = {
    map    : this.key,
    players: [],
  };

  onUpdate = (state: MapState) => {
  };

  constructor(public readonly key: string, scene: typeof ServerScene) {
    const config: Phaser.Types.Core.GameConfig = {
      type   : Phaser.HEADLESS,
      width  : 640,
      height : 480,
      banner : false,
      audio  : { noAudio: true },
      scene  : [],
      fps    : {
        target: FPS,
      },
      physics: {
        default: 'arcade',
        arcade : {
          gravity: { x: 0, y: 0 },
        },
      },
    };
    this.game                                  = new Phaser.Game(config);
    this.game.scene.add(this.key, scene);
    this.game.scene.start(this.key);
    this.scene = this.game.scene.getAt(0) as ServerScene;
  }

  update() {
    let state: MapState = {
      map    : this.key,
      players: this.scene.playerArray.map(player => player.toState()),
    };
    if (JSON.stringify(this.state) !== JSON.stringify(state)) {
      this.state = state;
      this.onUpdate(this.state);
    }
  }
}
