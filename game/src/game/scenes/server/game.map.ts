import Phaser          from 'phaser';
import { ServerScene } from './server.scene';

const FPS = 30;
// Create as many of these as needed to serve as map servers.
// Running this in the browser may allow for multiple instances of phaser or scenes
export class GameMap {

  game: Phaser.Game;
  scene:ServerScene;

  constructor(public readonly key: string,   scene: typeof ServerScene) {
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
    this.game.scene.add(this.key, this.scene);
    this.game.scene.start(this.key);
    this.scene = this.game.scene.getAt(0) as ServerScene;
  }
}
