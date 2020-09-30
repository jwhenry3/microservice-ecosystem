import { WorldScene }  from '../../world.scene';

export class Zone1Scene extends WorldScene {
  key = 'zone-1';
  map!: Phaser.Tilemaps.Tilemap;
  collisions!:Phaser.Tilemaps.StaticTilemapLayer;
  preload() {
    this.load.image('tiles', '/assets/tmw_desert_spacing.png');
    this.load.tilemapTiledJSON('desert', '/assets/desert.json');

  }
  create() {
    this.map = this.make.tilemap({key:'desert'});
    let tiles = this.map.addTilesetImage('Desert', 'tiles');
    this.map.setCollisionBetween(1,999, true, false, 'Collision');
    let layer1 = this.map.createStaticLayer('Ground', tiles, 0,0);
    this.collisions = this.map.createStaticLayer('Collision', tiles, 0,0);
    super.create();

  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    this.physics.collide(this.playerGroup, this.collisions);
  }
}
