import { PathfindingPlugin } from '../plugins/pathfinding';
import { Player }            from '../../game/player';
import { WorldScene }        from '../../game/scenes/world.scene';

export class CharacterMovement {

  path: [number, number][] = [];

  sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Arc;

  constructor(public scene: WorldScene, public pathfinding: PathfindingPlugin, public subject: Player) {
    this.sprite = this.subject.sprite;
  }

  update() {
    if (this.path.length) {
      let distance = this.getDistance();
      if (distance > 1) {
        this.setVelocityFromPath();
        this.scene.physics.collide(this.scene.wallGroup, this.sprite);
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

  private getVelocityFromPath() {
    let velocity = {
      x: (this.path[0][0]) - this.sprite.x,
      y: (this.path[0][1]) - this.sprite.y,
    };
    velocity.x   = Math.floor(velocity.x * 4);
    velocity.y   = Math.floor(velocity.y * 4);
    this.adjustDiagonal(velocity);
    return velocity;
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
