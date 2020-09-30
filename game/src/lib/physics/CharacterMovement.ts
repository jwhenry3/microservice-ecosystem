import { Player }     from '../../game/player';
import { WorldScene } from '../../game/scenes/world.scene';

export class CharacterMovement {

  path: [number, number][] = [];

  sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Arc;

  constructor(public scene: WorldScene, public subject: Player) {
    this.sprite = this.subject.sprite;
  }

  update() {
    if (this.path.length) {
      let distance = this.getDistance();
      if (distance > 1) {
        if (distance < 12 && this.path.length === 1) {
          this.getVelocityBasedOnDistance();
        } else {
          this.setVelocityFromPath();
        }
        if (distance < 24 && this.path.length > 1) {
          this.getNextNode();
        }
      } else {
        this.snapPosition();
        this.getNextNode();
      }
    }
    if (!this.path.length && (this.sprite.body.velocity.x !== 0 || this.sprite.body.velocity.y !== 0)) {
      this.stop();
    }
  }

  private setVelocityFromPath() {
    let velocity                = this.getVelocityFromPath();
    this.sprite.body.velocity.x = velocity.x;
    this.sprite.body.velocity.y = velocity.y;
  }

  private stop() {
    this.path                   = [];
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sendNewData();
  }

  private snapPosition() {
    if (this.path.length) {
      this.sprite.x = (this.path[0][0]);
      this.sprite.y = (this.path[0][1]);
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
          Math.round(this.sprite.x),
          Math.round(this.sprite.y),
        ],
        this.path,
      ).then();
    }
  }

  private getVelocityBasedOnDistance() {
    let velocity = {
      x: (this.path[0][0]) - this.sprite.x,
      y: (this.path[0][1]) - this.sprite.y,
    };
    velocity.x   = Math.floor((velocity.x / velocity.x) * 4);
    velocity.y   = Math.floor((velocity.y) * 4);
    this.adjustDiagonal(velocity);
    return velocity;
  }

  private getVelocityFromPath() {
    let angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, this.path[0][0], this.path[0][1]);
    return {
      x: Math.cos(angle) * 320,
      y: Math.sin(angle) * 320,
    };
  }

  private adjustDiagonal(velocity: { x: number, y: number }) {
    if (velocity.x !== 0 && velocity.y !== 0) {
      velocity.x /= 1.4142;
      velocity.y /= 1.4142;
    }
  }

  getDistance() {
    return Phaser.Math.Distance.BetweenPoints({ x: this.sprite.x, y: this.sprite.y }, {
      x: (this.path[0][0]),
      y: (this.path[0][1]),
    });
  }
}
