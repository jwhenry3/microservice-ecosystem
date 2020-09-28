import { Injectable }             from '@nestjs/common';
import { ClientProxy }            from '@nestjs/microservices';
import { Repository }             from 'typeorm';
import { LocationEntity }         from './entities/location.entity';
import { InjectRepository }       from '@nestjs/typeorm';
import { interval, Subscription } from 'rxjs';
import { CharacterModel }         from '../../../game/src/models/character.model';

export interface PlayerState {
  id: number
  name: string
  x: number
  y: number
  path: [number, number][]
}

@Injectable()
export class MapService {
  maps: {
    [key: string]: {
      players: {
        [id: number]: PlayerState
      }
    }
  } = {};

  loop: Subscription;

  constructor(private client: ClientProxy, @InjectRepository(LocationEntity) private repo: Repository<LocationEntity>) {
  }

  start() {
    this.maps['zone-1'] = {
      players: {},
    };
    this.loop           = interval(500).subscribe(() => {
      for (let key of Object.keys(this.maps)) {
        this.client.emit('emit.to', {
          event: 'map.update',
          id   : 'map.' + key,
          data : {
            map    : key,
            players: Object.keys(this.maps[key].players).map(id => this.maps[key].players[id]),
          },
        });
      }
    });
  }

  stop() {
    this.loop?.unsubscribe();
    delete this.loop;
  }

  async onJoin(characterId: number, requesterId: string) {
    let character = await this.getCharacter(characterId, requesterId);
    if (character) {
      let location = await this.repo.findOne({ where: { characterId: character.id } });
      if (location?.online) {
        return false;
      }
      if (!location) {
        location             = new LocationEntity();
        location.characterId = characterId;
        location.map         = 'zone-1';
        location.x           = 10;
        location.y           = 10;
      }
      location.accountId                           = character.accountId;
      location.online                              = true;
      this.maps[location.map].players[characterId] = {
        id  : characterId,
        name: character.name,
        x   : location.x,
        y   : location.y,
        path: [],
      };
      await this.repo.save(location);
      return location;
    }
    return null;
  }

  private getCharacter(characterId: number, requesterId: string): Promise<CharacterModel> {
    return this.client.send('request.character.get', {
      data: { id: characterId },
      requesterId,
    }).toPromise();
  }

  async onLeave(characterId: number, requesterId: string) {
    let character = await this.getCharacter(characterId, requesterId);
    if (character) {
      let location = await this.repo.findOne({ where: { characterId: characterId } });
      if (location) {
        this.removePlayerLocation(location);
      }
    }
    return null;
  }

  private async removePlayerLocation(location: LocationEntity) {
    location.online = false;
    await this.repo.save(location);
    delete this.maps[location.map].players[location.characterId];
    return location;
  }

  async onLogout(accountId: number) {
    let locations = await this.repo.find({ where: { accountId: accountId, online: true } });
    for (let location of locations) {
      this.removePlayerLocation(location);
    }
  }

  async onMove(characterId: number, position: [number, number], path: [number, number][], requesterId: string) {
    let character = await this.getCharacter(characterId, requesterId);
    if (character) {
      let location = await this.repo.findOne({ where: { characterId: characterId } });
      if (location) {
        this.maps[location.map].players[characterId] = {
          id  : characterId,
          name: character.name,
          x   : position[0],
          y   : position[1],
          path,
        };
        return path;
      }
    }
    return null;
  }
}
