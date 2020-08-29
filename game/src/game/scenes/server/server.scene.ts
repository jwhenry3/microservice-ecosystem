import { WorldScene } from '../world.scene';

export class ServerScene extends WorldScene {

  resize() {
    let bounds                          = this.game.scale.canvas.getBoundingClientRect();
    this.game.scale.canvasBounds.width  = bounds.width;
    this.game.scale.canvasBounds.height = bounds.height;

  }
}
