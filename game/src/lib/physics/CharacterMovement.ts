import { PathfindingPlugin } from '../plugins/pathfinding';
import { WorldScene }        from '../../game/scenes/world.scene';

export class CharacterMovement {

  path: Phaser.Geom.Point[] = [];

  constructor(public scene: WorldScene, public pathfinding: PathfindingPlugin, public subject: Phaser.GameObjects.Arc | Phaser.GameObjects.Sprite) {
  }

  findPath() {
    this.pathfinding.findPath(
      { x: this.subject.x, y: this.subject.y },
      { x: this.scene.input.activePointer.worldX, y: this.scene.input.activePointer.worldY },
        )
        .then((result) => {
          if (result && result?.length > 1) {
            result.splice(0, 1);
            this.path = result;
          }
        });
  }

  update() {
    if (this.path.length) {
      let distance = this.getDistance();
      if (distance > 1) {
        this.setVelocityFromPath();
        this.scene.physics.world.collide(this.subject, this.scene.walls, () => this.adjustCollisionVelocity());
        if (distance < 20 && this.path.length > 1) {
          this.getNextNode();
        }
      } else {
        this.snapPosition();
        this.getNextNode();
      }
      if (!this.path.length) {
        this.stop();
      }
    }
  }

  private setVelocityFromPath() {
    let velocity                 = this.getVelocityFromPath();
    this.subject.body.velocity.x = velocity.x;
    this.subject.body.velocity.y = velocity.y;
  }

  private stop() {
    this.path                    = [];
    this.subject.body.velocity.x = 0;
    this.subject.body.velocity.y = 0;
  }

  private snapPosition() {
    if (this.path.length) {
      this.subject.x = this.path[0].x;
      this.subject.y = this.path[0].y;
    }
  }

  private getNextNode() {
    this.path.splice(0, 1);
  }

  private adjustCollisionVelocity() {
    if (this.subject.body.velocity.x !== 0) {
      this.subject.body.velocity.x *= 1.4142;
    }
    if (this.subject.body.velocity.y !== 0) {
      this.subject.body.velocity.y *= 1.4142;
    }
  }

  private getVelocityFromPath() {
    let velocity = new Phaser.Geom.Point(
      (this.path[0].x - this.subject.x),
      (this.path[0].y - this.subject.y),
    );
    velocity.x   = velocity.x * 4;
    velocity.y   = velocity.y * 4;
    this.limitSpeed(velocity);
    this.adjustDiagonal(velocity);
    return velocity;
  }

  private adjustDiagonal(velocity: Phaser.Geom.Point) {
    if (Math.abs(velocity.x) === Math.abs(velocity.y)) {
      velocity.x /= 1.4142;
      velocity.y /= 1.4142;
    }
  }

  private limitSpeed(velocity: Phaser.Geom.Point) {
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
  }

  getDistance() {
    return Phaser.Math.Distance.BetweenPoints({ x: this.subject.x, y: this.subject.y }, {
      x: this.path[0].x,
      y: this.path[0].y,
    });
  }
}
