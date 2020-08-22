import * as easyStar  from 'easystarjs';
import { collisions } from '../physics/collisions';
import { walkable }   from '../physics/loadCollisions';

export class PathfindingPlugin {

  easyStar = new easyStar.js();
  collisionData!: { [key: number]: number[][] };

  get gridWidth() {
    return this.collisionData[0][0].length;
  }

  get gridHeight() {
    return this.collisionData[0].length;
  }

  init(data?: { key: string }): void {
    if (data?.key) {
      this.collisionData = collisions[data.key];
      if (this.collisionData[0]) {
        this.easyStar.setGrid(this.collisionData[0]);
        this.easyStar.setAcceptableTiles(walkable);
        this.easyStar.enableCornerCutting();
      }
    }
  }

  findPath = (origin, target): Promise<Phaser.Geom.Point[] | null> => {

    let origin_coord = this.getCoordFromPoint(origin);
    let target_coord = this.getCoordFromPoint(target);

    if (!this.outsideGrid(origin_coord) && !this.outsideGrid(target_coord)) {
      return new Promise(resolve => {
        try {
          this.easyStar.findPath(origin_coord.column, origin_coord.row, target_coord.column, target_coord.row, (path) => {
            resolve(this.buildPoints(path));
          });
          this.easyStar.calculate();
        } catch (e) {
          resolve(null);
        }
      });
    }
    return new Promise(resolve => resolve(null));
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
    return coord.row < 0 || coord.row > this.gridHeight - 1 || coord.column < 0 || coord.column > this.gridWidth - 1;
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
