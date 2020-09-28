import { PathfindingPlugin } from '../plugins/pathfinding';
import { Player }            from '../../game/player';
import { WorldScene }        from '../../game/scenes/world.scene';

export class CharacterMovement {

  path: [number, number][] = [];

  constructor(public scene: WorldScene, public pathfinding: PathfindingPlugin, public subject: Player) {
  }

  findPath(x, y) {
    return this.pathfinding.findPath(
      [Math.floor(this.subject.x / 32), Math.floor(this.subject.y / 32)],
      [x, y],
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
        this.scene.physics.world.collide(this.subject, this.scene.wallGroup, () => this.adjustCollisionVelocity());
        if (distance < 20 && this.path.length > 1) {
          this.getNextNode();
        }
      } else {
        this.snapPosition();
        this.getNextNode();
      }
    }
    if (!this.path.length && (this.subject.body.velocity.x !== 0 || this.subject.body.velocity.y !== 0)) {
      this.stop();
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
    this.sendNewData();
  }

  private snapPosition() {
    if (this.path.length) {
      this.subject.x = (this.path[0][0] * 32);
      this.subject.y = (this.path[0][1] * 32);
      this.sendNewData();
    }
  }

  private getNextNode() {
    this.path = this.path.filter((ele, index) => index !== 0);
    this.sendNewData();
  }

  private sendNewData() {
    if (this.subject.self) {
      this.scene.game.network.map.move(
        this.subject.id,
        [
          Math.round(this.subject.x / 32),
          Math.round(this.subject.y / 32),
        ],
        this.path,
      ).then();
    }
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
    let velocity = {
      x: (this.path[0][0] * 32) - this.subject.x,
      y: (this.path[0][1] * 32) - this.subject.y,
    };
    velocity.x   = Math.floor(velocity.x * 4);
    velocity.y   = Math.floor(velocity.y * 4);
    this.limitSpeed(velocity);
    this.adjustDiagonal(velocity);
    return velocity;
  }

  private adjustDiagonal(velocity: { x: number, y: number }) {
    if (Math.abs(velocity.x) === Math.abs(velocity.y)) {
      velocity.x /= 1.4142;
      velocity.y /= 1.4142;
    }
  }

  private limitSpeed(velocity: { x: number, y: number }) {
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
      x: (this.path[0][0] * 32),
      y: (this.path[0][1] * 32),
    });
  }
}
