import { Controller, Get }              from '@nestjs/common';
import { MapService }                   from './map.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class MapController {
  constructor(private readonly service: MapService) {
    this.service.start();
  }

  @MessagePattern('request.map.join')
  async onJoined({ data, requesterId }: { data: { characterId: number }, requesterId: string }) {
    return await this.service.onJoin(data.characterId, requesterId);
  }

  @MessagePattern('request.map.leave')
  async onLeft({ data }: { data: { characterId: number }, requesterId: string }) {
    return await this.service.onLeave(data.characterId);
  }

  @MessagePattern('request.map.move')
  async onMove({ data }: { data: { characterId: number, destination: [number, number] }, requesterId: string }) {
    console.log('move!', data);
    return await this.service.onMove(data.characterId, data.destination);
  }
}
