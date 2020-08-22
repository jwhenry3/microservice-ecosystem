import { PathfindingPlugin } from '../plugins/pathfinding';
import { WorldScene }        from '../../game/scenes/world/world.scene';

export class CharacterMovement {

  path: Phaser.Geom.Point[] = [];

  constructor(public scene: WorldScene, public pathfinding: PathfindingPlugin, public target: Phaser.GameObjects.Arc) {
  }

  findPath() {
    this.pathfinding.findPath({
        x: this.target.x,
        y: this.target.y,
      },
      {
        x: this.scene.input.activePointer.worldX,
        y: this.scene.input.activePointer.worldY,
      })
        .then(result => {
          if (result) {
            if (result.length > 1) {
              result.splice(0, 1);
              this.path = result;
            }
          }
        });
  }

  update() {
    if (this.path.length) {
      let distance = this.getDistance();
      if (distance > 1) {
        let velocity = new Phaser.Geom.Point(
          (this.path[0].x - this.target.x),
          (this.path[0].y - this.target.y),
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
        this.target.body.velocity.x = velocity.x;
        this.target.body.velocity.y = velocity.y;
        this.scene.physics.world.collide(this.target, this.scene.walls);
        if (distance < 24 && this.path.length > 1) {
          this.path.splice(0, 1);
        }
      } else {
        if (this.path.length) {
          this.target.x = this.path[0].x;
          this.target.y = this.path[0].y;
          this.path.splice(0, 1);
        }
      }
    }
    if (!this.path.length) {
      this.path                   = [];
      this.target.body.velocity.x = 0;
      this.target.body.velocity.y = 0;
    }

  }

  getDistance() {
    return Phaser.Math.Distance.BetweenPoints({ x: this.target.x, y: this.target.y }, {
      x: this.path[0].x,
      y: this.path[0].y,
    });
  }
}
