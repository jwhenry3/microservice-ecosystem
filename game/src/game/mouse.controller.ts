import { WorldScene }  from './scenes/world.scene';

export class MouseController {
  hasClicked = false;

  update(scene: WorldScene) {
    if (scene.myPlayer) {
      let sprite = scene.myPlayer.sprite;
      let mouseDown = scene.input.mousePointer.leftButtonDown();
      if (!this.hasClicked && mouseDown) {
        this.hasClicked = true;
        let coord       = [Math.round(scene.input.activePointer.worldX / 32),
                           Math.round(scene.input.activePointer.worldY / 32)];
        let space       = scene.pathfinding.collisionData[0][coord[1]][coord[0]];
        if (space !== 1) {
          let movement = scene.myPlayer.movement;
          movement.findPath(
            Math.round(scene.input.activePointer.worldX / 32),
            Math.round(scene.input.activePointer.worldY / 32),
          ).then(() => {
            if (movement.path?.length) {
              return scene.game.network.map.move(
                scene.myPlayer!.id,
                [
                  Math.round(sprite.x / 32),
                  Math.round(sprite.y / 32),
                ],
                movement.path
              );
            }
          });
        } else {
        }
      }
      if (!mouseDown) {
        this.hasClicked = false;
      }
    }
  }
}
