import { collisions } from './collisions';

export const colors = {
  1: '#cdcdcd',
  2: '#457daa',
  3: '#eaff76',
};

export function getColor(color: string) {
  return Phaser.Display.Color.HexStringToColor(color).color;
}

export const walkable = [0, -1, 3];

export function loadCollisions(scene: Phaser.Scene & { key: string }) {
  let collisionData = collisions[scene.key] || {};
  if (Object.keys(collisionData).length) {
    let firstLevel = collisionData[0];
    let width      = firstLevel[0].length;
    let height     = firstLevel.length;
    let grid       = scene.add.grid((32 * width / 2) - 16, (32 * height / 2) - 16, 32 * width, 32 * height, 32, 32, getColor('#00cc88'), 0.5, getColor('#0000ff'));
    let walls      = scene.add.group();
    for (let y = 0; y < firstLevel.length; y++) {
      for (let x = 0; x < firstLevel[y].length; x++) {
        if (firstLevel[y][x] > 0) {
          let square = scene.add.rectangle((x * 32), (y * 32), 32, 32, getColor(colors[firstLevel[y][x]]));
          scene.physics.add.existing(square, true);
          if (!walkable.includes(firstLevel[y][x])) {
            walls.add(square);
          }
        }
      }
    }
    return { grid, walls: walls };
  }
  return null;
}
