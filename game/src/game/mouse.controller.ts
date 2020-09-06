import { ClientScene } from './scenes/client/client.scene';

export class MouseController {
  hasClicked = false;

  update(scene: ClientScene) {
    if (scene.myPlayer) {
      let mouseDown = scene.input.mousePointer.leftButtonDown();
      if (!this.hasClicked && mouseDown) {
        this.hasClicked = true;
        scene.game.network.map.move(
          scene.myPlayer.id,
          Math.round(scene.input.activePointer.worldX / 32),
          Math.round(scene.input.activePointer.worldY / 32),
        ).then(() => {
        });
      }
      if (!mouseDown) {
        this.hasClicked = false;
      }
    }
  }
}
