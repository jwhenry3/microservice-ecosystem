import { CONSTANTS }     from '../../../../game/src/lib/constants';
import { P2World }       from './p2-world';
import { PathFinder }    from './pathfinding';
import { BodyWithState } from './body-with-state';

export class PhysicalBody extends BodyWithState {
  world: P2World;
  bodyState: any           = {};
  animationBasedOnPress    = false;
  diagonalHorizontal       = false;
  autoMoving: number[][]   = null;
  pathFinder: PathFinder   = null;
  // default or initial direction:
  pressedDirection         = CONSTANTS.DOWN;
  currentCol: number       = null;
  currentRow: number       = null;
  originalCol: number      = null;
  originalRow: number      = null;
  isBullet                 = false;

  constructor(options) {
    super(options);
    this.animationBasedOnPress = options.animationBasedOnPress;
    this.diagonalHorizontal    = options.diagonalHorizontal;
  }

  integrate(dt) {
    super.integrate(dt);
    if (this.autoMoving && this.autoMoving.length) {
      this.speedToNext();
    }
    if (this.bodyState) {
      this.updateBodyState();
    }
  }

  speedToNext() {
    // @TODO: this can be improved but for now we can use the cols and rows to follow the path since it doesn't
    //   needs to be an exact method (it is not the user is choosing each point of the path to follow). In order to
    //   make it more accurate we need to use the position, but with the current configuration it will be also an
    //   approximation since there it has issues between the world step and the objects speed, where the position
    //   is passed in between steps.
    //   Additionally we still need to include the position fix for the cases where the moving object is bigger
    //   than a single tile.
    if (this.currentCol === this.autoMoving[0][0] && this.currentRow === this.autoMoving[0][1]) {
      // if the point was reach then remove it to process the next one:
      this.autoMoving.shift();
      if (!this.autoMoving.length) {
        // if there are no more points to process then stop the body and reset the path:
        this.velocity = [0, 0];
        this.resetAuto();
      }
    } else {
      if (this.currentCol === this.autoMoving[0][0] && this.velocity[0] !== 0) {
        this.velocity[0] = 0;
      }
      if (this.currentCol > this.autoMoving[0][0]) {
        this.initMove(CONSTANTS.LEFT, true);
      }
      if (this.currentCol < this.autoMoving[0][0]) {
        this.initMove(CONSTANTS.RIGHT, true);
      }
      if (this.currentRow === this.autoMoving[0][1] && this.velocity[1] !== 0) {
        this.velocity[1] = 0;
      }
      if (this.currentRow > this.autoMoving[0][1]) {
        this.initMove(CONSTANTS.UP, true);
      }
      if (this.currentRow < this.autoMoving[0][1]) {
        this.initMove(CONSTANTS.DOWN, true);
      }
      this.updateCurrentPoints();
    }
  }

  updateBodyState() {
    // only update the body if it moves:
    if (
      this.bodyState.x === this.position[0] && this.bodyState.y === this.position[1]
      && this.velocity[0] === 0 && this.velocity[1] === 0
    ) {
      this.bodyState.mov = false;
      return;
    }
    // @TODO: remove from here or change property name from isBullet to shouldRemove or shouldStop on world
    //   boundaries.
    if (this.isBullet) {
      if (
        this.position[0] < 0 || this.position[0] > (this.worldWidth * this.worldTileWidth)
        || this.position[1] < 0 || this.position[1] > (this.worldHeight * this.worldTileHeight)
      ) {
        this.world.removeBodies.push(this);
      }
    }
    // update position:
    this.bodyState.x   = this.position[0];
    this.bodyState.y   = this.position[1];
    // start or stop animation:
    this.bodyState.mov = (this.velocity[0] !== 0 || this.velocity[1] !== 0);
  }

  resetAuto() {
    this.autoMoving = [];
  }

  initMove(direction, isAuto = false) {
    if (!isAuto) {
      // if user moves the player then reset the auto move.
      this.resetAuto();
    }
    let speed = this.world.worldSpeed;
    if (direction === CONSTANTS.RIGHT) {
      this.validateAndSetDirection(direction, this.diagonalHorizontal, this.velocity[1]);
      this.velocity[0] = speed;
    }
    if (direction === CONSTANTS.LEFT) {
      this.validateAndSetDirection(direction, this.diagonalHorizontal, this.velocity[1]);
      this.velocity[0] = -speed;
    }
    if (direction === CONSTANTS.UP) {
      this.validateAndSetDirection(direction, !this.diagonalHorizontal, this.velocity[0]);
      this.velocity[1] = -speed;
    }
    if (direction === CONSTANTS.DOWN) {
      this.validateAndSetDirection(direction, !this.diagonalHorizontal, this.velocity[0]);
      this.velocity[1] = speed;
    }
  }

  validateAndSetDirection(direction, diagonal, velocity) {
    if (this.animationBasedOnPress) {
      if (diagonal || velocity === 0) {
        this.bodyState.dir = direction;
      }
    }
  }

  stopMove() {
    // stop by setting speed to zero:
    this.velocity = [0, 0];
  }

  moveToPoint(toPoint) {
    this.resetAuto();
    this.updateCurrentPoints();
    let fromPoints  = [this.currentCol, this.currentRow];
    let toPoints    = [toPoint.column, toPoint.row];
    this.autoMoving = this.getPathFinder().findPath(fromPoints, toPoints);
    if (!this.autoMoving.length) {
      this.stopMove();
    }
    return this.autoMoving;
  }

  updateCurrentPoints() {
    // if the player disconnects and it's the only one on the room the world would be destroyed at this point:
    if (!this.world) {
      return;
    }
    let currentCol = Math.round(this.position[0] / this.worldTileWidth);
    currentCol     = (currentCol >= 0) ? ((currentCol > this.worldWidth) ? (this.worldWidth) : currentCol) : 0;
    let currentRow = Math.round(this.position[1] / this.worldTileHeight);
    currentRow     = (currentRow >= 0) ? ((currentRow > this.worldHeight) ? (this.worldHeight) : currentRow) : 0;
    if (!this.currentCol) {
      this.originalCol = currentCol;
    }
    if (!this.currentRow) {
      this.originalRow = currentRow;
    }
    this.currentCol = currentCol;
    this.currentRow = currentRow;
  }

  moveToOriginalPoint() {
    if (!this.originalCol || this.originalRow) {
      this.updateCurrentPoints();
    }
    this.moveToPoint({ column: this.originalCol, row: this.originalRow });
  }

  getPathFinder(): PathFinder {
    // @NOTE: body path finder is for when the body has it's own respawn area and grid, the world path finder is for
    // any object in the room that could be anywhere in the room.
    return (this.pathFinder ? this.pathFinder : this.world.pathFinder);
  }

  get worldTileWidth() {
    return this.world.mapJson.tilewidth;
  }

  get worldTileHeight() {
    return this.world.mapJson.tileheight;
  }

  get worldWidth() {
    return this.world.mapJson.width;
  }

  get worldHeight() {
    return this.world.mapJson.height;
  }

}
