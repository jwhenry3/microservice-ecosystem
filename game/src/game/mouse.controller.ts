import { WorldScene }   from './scenes/world.scene';
import { PlayerSprite } from './entities/player.sprite';

export class MouseController {
  hasClicked = false;

  currentDestination = [[0, 0]];


  update(scene: WorldScene) {
    if (scene.myPlayer) {
      let id        = scene.myPlayer.id;
      let sprite    = scene.myPlayer.sprite;
      let mouseDown = scene.input.activePointer.isDown;

      if (mouseDown) {
        let { current, path } = this.getMovementDetails(scene, sprite);
        if (JSON.stringify(this.currentDestination) !== JSON.stringify(path)) {
          this.currentDestination = path;
          scene.game.network.map.move(
            id,
            current,
            path,
          ).then();
        }
      }
    }
  }

  private getMovementDetails(scene: WorldScene, sprite: PlayerSprite) {
    scene.input.activePointer.updateWorldPoint(scene.cameras.main);
    let destination: [number, number] = [Math.round(scene.input.activePointer.worldX),
                                         Math.round(scene.input.activePointer.worldY),
    ];
    let current: [number, number]     = [
      Math.round(sprite.x),
      Math.round(sprite.y),
    ];
    let path                          = [destination];
    return { current, path };
  }
}
