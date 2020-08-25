import Phaser       from 'phaser';
import { getColor } from '../../lib/physics/loadCollisions';

// Create as many of these as needed to serve as map servers.
// Running this in the browser may allow for multiple instances of phaser or scenes
export class GameMap {

  game: Phaser.Game;
  canvasHolder: HTMLDivElement;

  constructor(public readonly key: string, public readonly container: HTMLDivElement, public readonly scene: any) {
    this.canvasHolder    = document.createElement('div');
    this.canvasHolder.id = 'game-map-' + key;
    let existing         = document.getElementById(this.canvasHolder.id) as HTMLDivElement;
    if (existing) {
      this.canvasHolder = existing;
    } else {
      container.appendChild(this.canvasHolder);
    }
    this.game = new Phaser.Game({
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
      parent   : this.canvasHolder,
      scale    : {
        mode: Phaser.Scale.RESIZE,
      },
    });
    this.game.scene.add(this.key, this.scene);
    this.game.scene.start(this.key);
  }
}
