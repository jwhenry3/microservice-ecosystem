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
    let destination: [number, number] = [Math.round(scene.input.activePointer.worldX / 32),
                                         Math.round(scene.input.activePointer.worldY / 32),
    ];
    let current: [number, number]     = [
      Math.round(sprite.x / 32),
      Math.round(sprite.y / 32),
    ];
    let diff: [number, number]        = [
      destination[0] - current[0],
      destination[1] - current[1],
    ];
    let newCoord: [number, number]    = [
      current[0] + (diff[0] > 0 ? 1 : diff[0] < 0 ? -1 : 0),
      current[1] + (diff[1] > 0 ? 1 : diff[1] < 0 ? -1 : 0),
    ];
    let path                          = [newCoord];
    if (Math.abs(diff[0]) > 1 || Math.abs(diff[1]) > 1) {
      path.push([
        path[0][0] + (diff[0] > 1 ? 1 : diff[0] < -1 ? -1 : 0),
        path[0][1] + (diff[1] > 1 ? 1 : diff[1] < -1 ? -1 : 0),
      ]);
    }
    if (Math.abs(diff[0]) > 2 || Math.abs(diff[1]) > 2) {
      path.push([
        path[1][0] + (diff[0] > 1 ? 1 : diff[0] < -1 ? -1 : 0),
        path[1][1] + (diff[1] > 1 ? 1 : diff[1] < -1 ? -1 : 0),
      ]);
    }
    return { current, path };
  }
}
