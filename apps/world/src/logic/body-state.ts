import { CONSTANTS } from '../../../../game/src/lib/constants';

export class BodyState {
  id: number     = null;
  roomId: string = '';
  scene: string  = '';
  x: number      = 0;
  y: number      = 0;
  dir: string    = CONSTANTS.DOWN;
  mov: boolean   = false;

  constructor(options: Partial<BodyState>) {
    this.id     = options.id || null;
    this.roomId = options.roomId || '';
    this.scene  = options.scene || '';
    this.x      = Number(options.x);
    this.y      = Number(options.y);
    this.dir    = options.dir;
    this.mov    = options.mov || false;
  }
}
