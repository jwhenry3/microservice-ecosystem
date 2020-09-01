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
        this.easyStar.enableDiagonals();
      }
    }
  }

  findPath = (origin, target): Promise<[number, number][] | null> => {

    if (!this.outsideGrid(origin) && !this.outsideGrid(target)) {
      return new Promise(resolve => {
        try {
          this.easyStar.findPath(origin[0], origin[1], target[0], target[1], (path) => {
            let built = this.buildPoints(path);
            resolve(built);
          });
          this.easyStar.calculate();
        } catch (e) {
          resolve(null);
        }
      });
    }
    return new Promise(resolve => resolve(null));
  };

  buildPoints = (path: { x: number, y: number }[]): [number, number][] => {
    if (path?.length) {
      return path.map(path => [path.x, path.y]);
    }
    return [];
  };

  outsideGrid = (coord) => {
    return coord.row < 0 || coord.row > this.gridHeight - 1 || coord.column < 0 || coord.column > this.gridWidth - 1;
  };
}
