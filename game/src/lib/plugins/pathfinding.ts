import * as easyStar  from 'easystarjs';
import { collisions } from '../physics/collisions';

export class PathfindingPlugin {

  easyStar = new easyStar.js();

  init(data?: { key: string }): void {
    console.log(data);
    if (data?.key) {
      let collisionData = collisions[data.key];
      if (collisionData[0]) {
        this.easyStar.setGrid(collisionData[0]);
        this.easyStar.setAcceptableTiles([0]);
      }
    }
  }

  findPath = (origin, target): Promise<Phaser.Geom.Point[]> => {

    let origin_coord = this.getCoordFromPoint(origin);
    let target_coord = this.getCoordFromPoint(target);

    if (!this.outsideGrid(origin_coord) && !this.outsideGrid(target_coord)) {
      return new Promise(resolve => {
        this.easyStar.findPath(origin_coord.column, origin_coord.row, target_coord.column, target_coord.row, (path) => {
          resolve(this.buildPoints(path));
        });
        this.easyStar.calculate();
      });
    }
    return new Promise(resolve => resolve([]));
  };

  buildPoints = (path: { x: number, y: number }[]) => {
    let path_positions: Phaser.Geom.Point[] = [];
    if (path?.length) {
      path.forEach((path_coord) => {
        path_positions.push(this.getPointFromCoord({ row: path_coord.y, column: path_coord.x }));
      });
    }
    return path_positions;
  };

  outsideGrid = (coord) => {
    return coord.row < 0 || coord.row > 32 - 1 || coord.column < 0 || coord.column > 32 - 1;
  };

  getCoordFromPoint = (point) => {
    let row    = Math.floor(point.y / 32);
    let column = Math.floor(point.x / 32);
    return { row, column };
  };

  getPointFromCoord = (coord): Phaser.Geom.Point => {
    let x = (coord.column * 32) + (32 / 2);
    let y = (coord.row * 32) + (32 / 2);
    return new Phaser.Geom.Point(x, y);
  };
}
