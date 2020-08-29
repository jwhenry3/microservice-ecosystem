import { Controller, Get } from '@nestjs/common';
import { MapService }      from './map.service';
import { EventPattern }    from '@nestjs/microservices';

@Controller()
export class MapController {
  constructor(private readonly service: MapService) {
  }

  @EventPattern('emit.map.change')
  onMapChange({ characterId, map }: { characterId: number, map: string }) {
    this.service.onChanged(characterId, map);
  }

  @EventPattern('emit.map.online')
  onJoined({ characterId }: { characterId: number }) {
    this.service.onJoined(characterId);
  }

  @EventPattern('emit.map.offline')
  onLeft({ characterId }: { characterId: number }) {
    this.service.onLeft(characterId);
  }

  @EventPattern('emit.map.move')
  onMove({ characterId, destination }: { characterId: number, destination: [number, number] }) {
    this.service.onMove(characterId, destination);
  }
}
