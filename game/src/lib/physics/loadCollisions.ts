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
    let grid       = scene.add.grid(32 * width / 2,32 * height / 2, 32 * width, 32 * height, 32, 32, getColor('#00cc88'), 0.5, getColor('#0000ff'));
    let player = scene.add.circle(32 * width / 2,32 * height / 2, 16, getColor('#4477ff'));
    scene.cameras.main.startFollow(player, true, 320, 320);
    return {grid, player};
  }
  return null;
}
