import { collisions } from './collisions';

export function getColor(color: string) {
  return Phaser.Display.Color.HexStringToColor(color).color;
}

export function loadCollisions(scene: Phaser.Scene & { key: string }) {
  let collisionData = collisions[scene.key] || {};
  if (Object.keys(collisionData).length) {
    let firstLevel = collisionData[0];
    let width      = firstLevel[0].length;
    let height     = firstLevel.length;
    let grid       = scene.add.grid(32 * width / 2, 32 * height / 2, 32 * width, 32 * height, 32, 32, getColor('#00cc88'), 0.5, getColor('#0000ff'));
    let player     = scene.add.circle(32 * width / 2, 32 * height / 2, 12, getColor('#4477ff'));
    scene.physics.add.existing(player, false);
    let walls = scene.add.group();
    (player.body as Phaser.Physics.Arcade.Body).setBounce(0.5, 0.5).setCollideWorldBounds(true).setCircle(12);
    for (let y = 0; y < firstLevel.length; y++) {
      for (let x = 0; x < firstLevel[y].length; x++) {
        if (firstLevel[y][x] === 1) {
          let square = scene.add.rectangle(x * 32 + 16, y * 32 + 16, 32, 32, getColor('#777'));
          scene.physics.add.existing(square, true);
          walls.add(square);
        }
        if (firstLevel[y][x] === 2) {
          let circle = scene.add.circle(x * 32 + 16, y * 32 + 16, 16, getColor('#777'));
          scene.physics.add.existing(circle, true);
          walls.add(circle);
        }
      }
    }
    scene.cameras.main.startFollow(player, true, 16, 16);
    return { grid, player, walls: walls };
  }
  return null;
}
