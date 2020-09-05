import { Net } from './net';

export class MapNet {

  constructor(private net: Net) {
  }

  async join(characterId: number) {
    return await this.net.request('map.join', { characterId });
  }

  async leave(characterId: number) {
    return await this.net.request('map.leave', { characterId });
  }

  async move(characterId: number, x: number, y: number): Promise<[number,number][]> {
    return await this.net.request('map.move', { characterId, destination: [x, y] });
  }

  onUpdate(cb: (...args: any[]) => void) {
    this.net.on('map.update', cb);
  }
}
