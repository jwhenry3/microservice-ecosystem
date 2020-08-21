import { BaseScene }         from '../base.scene';
import { loadCollisions }    from '../../../lib/physics/loadCollisions';
import { movePlayer }        from '../../../lib/physics/movePlayer';
import { PathfindingPlugin } from '../../../lib/plugins/pathfinding';

export class Zone1Scene extends BaseScene {
  key = 'zone-1';

  grid!: Phaser.GameObjects.Grid;
  player!: Phaser.GameObjects.Arc;
  pathfinding!: PathfindingPlugin;

  preload() {
  }

  create() {
    super.create();
    this.pathfinding = new PathfindingPlugin();
    this.pathfinding.init({ key: this.key });
    let data = loadCollisions(this);
    if (data) {
      this.grid   = data.grid as Phaser.GameObjects.Grid;
      this.player = data.player as Phaser.GameObjects.Arc;
      this.physics.add.existing(this.player);
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
          console.log(result);
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
      if (!this.reachedTargetPosition()) {
        let velocity                = new Phaser.Geom.Point(
          (this.path[0].x - this.player.x),
          (this.path[0].y - this.player.y),
        );
        this.player.body.velocity.x = velocity.x * 4;
        this.player.body.velocity.y = velocity.y * 4;
      } else {
        if (this.path.length) {
          this.player.x = this.path[0].x;
          this.player.y = this.path[0].y;
          this.path.splice(0, 1);
        }
        if (!this.path.length) {
          this.path                   = [];
          this.player.body.velocity.x = 0;
          this.player.body.velocity.y = 0;
        }
      }
    }
  }

  reachedTargetPosition() {
    if (!this.path.length) {
      return true;
    }
    return Phaser.Math.Distance.BetweenPoints({ x: this.player.x, y: this.player.y }, {
      x: this.path[0].x,
      y: this.path[0].y,
    }) < 1;
  }
}
