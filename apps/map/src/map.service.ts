import { Injectable } from '@nestjs/common';
import { Zone1Scene } from '../../../game/src/game/scenes/world/zone-1.scene';
// set the fps you need
const FPS              = 30;
global['phaserOnNodeFPS'] = FPS; // default is 60


@Injectable()
export class MapService {
  game!: Phaser.Game;

  start() {

// prepare the config for Phaser
    const config: Phaser.Types.Core.GameConfig = {
      type   : Phaser.HEADLESS,
      width  : 640,
      height : 480,
      banner : false,
      audio  : { noAudio: true },
      scene  : [Zone1Scene],
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

// start the game
    this.game = new Phaser.Game(config);
  }
}
