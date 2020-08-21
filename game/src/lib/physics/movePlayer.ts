
export function movePlayer(scene: Phaser.Scene, player:Phaser.GameObjects.Arc, x:number, y:number) {
  let diff = {
    x: player.x - x,
    y: player.y - y
  };
  scene.tweens.add({
    targets: [player],
    props: {
      x
    },
    duration: 1000 * diff.x
  });
  scene.tweens.add({
    targets: [player],
    props: {
      y
    },
    duration: 1000 * diff.y
  });
}
