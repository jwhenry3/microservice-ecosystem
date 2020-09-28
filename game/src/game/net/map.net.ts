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

  async move(characterId: number, position: [number, number], path: [number, number][]): Promise<[number, number][]> {
    return await this.net.request('map.move', { characterId, position, path });
  }

  onUpdate(cb: (...args: any[]) => void) {
    this.net.on('map.update', cb);
  }
}
