import { BaseScene }         from '../base.scene';
import { loadCollisions }    from '../../../lib/physics/loadCollisions';
import { PathfindingPlugin } from '../../../lib/plugins/pathfinding';

export class Zone1Scene extends BaseScene {
  key = 'zone-1';

  grid!: Phaser.GameObjects.Grid;
  player!: Phaser.GameObjects.Arc;
  walls!: Phaser.GameObjects.Group;
  pathfinding!: PathfindingPlugin;

  preload() {
  }

  create() {
    super.create();
    this.pathfinding = new PathfindingPlugin();
    this.pathfinding.init({ key: this.key });
    let data = loadCollisions(this);
    if (data) {
      this.grid   = data.grid;
      this.player = data.player;
      this.walls  = data.walls;
    }
  }

  resize() {
  }

  hasClicked                = false;
  path: Phaser.Geom.Point[] = [];

  findPath() {
    this.pathfinding.findPath({
        x: this.player.x,
        y: this.player.y,
      },
      {
        x: this.input.activePointer.worldX,
        y: this.input.activePointer.worldY,
      })
        .then(result => {
          if (result.length > 1) {
            result.splice(0, 1);
          }
          this.path = result;
        });
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    if (this.grid && this.player) {
      let mouseDown = this.input.mousePointer.leftButtonDown();
      if (!this.hasClicked && mouseDown) {
        this.hasClicked = true;
        this.findPath();
      }
      if (!mouseDown) {
        this.hasClicked = false;
      }
      if (this.path.length) {
        let distance = this.getDistance();
        if (distance > 1) {
          let velocity = new Phaser.Geom.Point(
            (this.path[0].x - this.player.x),
            (this.path[0].y - this.player.y),
          );
          velocity.x   = velocity.x * 4;
          velocity.y   = velocity.y * 4;
          let maxSpeed = 120;
          if (velocity.x > maxSpeed) {
            velocity.x = maxSpeed;
          }
          if (velocity.x < -maxSpeed) {
            velocity.x = -maxSpeed;
          }
          if (velocity.y > maxSpeed) {
            velocity.y = maxSpeed;
          }
          if (velocity.y < -maxSpeed) {
            velocity.y = -maxSpeed;
          }
          if (Math.abs(velocity.x) === Math.abs(velocity.y)) {
            velocity.x /= 1.4142;
            velocity.y /= 1.4142;
          }
          this.player.body.velocity.x = velocity.x;
          this.player.body.velocity.y = velocity.y;
          this.physics.world.collide(this.player, this.walls);
          if (distance < 24 && this.path.length > 1) {
            this.path.splice(0, 1);
          }
        } else {
          if (this.path.length) {
            this.player.x = this.path[0].x;
            this.player.y = this.path[0].y;
            this.path.splice(0, 1);
          }
        }
      }
      if (!this.path.length) {
        this.path                   = [];
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
      }

    }
  }

  getDistance() {
    return Phaser.Math.Distance.BetweenPoints({ x: this.player.x, y: this.player.y }, {
      x: this.path[0].x,
      y: this.path[0].y,
    });
  }
}
