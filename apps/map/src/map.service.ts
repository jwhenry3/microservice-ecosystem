import { Injectable }             from '@nestjs/common';
import { Zone1Scene }             from '../../../game/src/game/scenes/server/world/zone-1.scene';
import { GameMap }                from '../../../game/src/game/scenes/server/game.map';
import { ClientProxy }            from '@nestjs/microservices';
import { Repository }             from 'typeorm';
import { LocationEntity }         from './entities/location.entity';
import { InjectRepository }       from '@nestjs/typeorm';
import { CONSTANTS }              from '../../../game/src/lib/constants';
import { interval, Subscription } from 'rxjs';
// set the fps you need
const FPS                 = 30;
global['phaserOnNodeFPS'] = FPS; // default is 60


@Injectable()
export class MapService {
  maps: { [key: string]: GameMap } = {};

  loop: Subscription;

  constructor(private client: ClientProxy, @InjectRepository(LocationEntity) private repo: Repository<LocationEntity>) {
  }

  start() {
    this.maps['zone-1']          = new GameMap('zone-1', Zone1Scene);
    this.maps['zone-1'].onUpdate = (state) => {
      console.log('state updated!', state);
      this.client.emit('emit.to', {
        event: 'map.update',
        id   : 'zone-1',
        data : state,
      });
    };

    this.loop = interval(300).subscribe(() => {
      this.maps['zone-1'].update();
    });
  }

  stop() {
    this.loop?.unsubscribe();
    delete this.loop;
  }

  async onJoin(characterId: number, requesterId: string) {
    let character = await this.client.send('request.' + CONSTANTS.GET_CHARACTER, {
      data: { id: characterId },
      requesterId,
    }).toPromise();
    if (character) {
      let location = await this.repo.findOne({ where: { characterId: character.id } });
      if (!location) {
        location             = new LocationEntity();
        location.online      = true;
        location.characterId = characterId;
        location.map         = 'zone-1';
        location.x           = 10;
        location.y           = 10;
        await this.repo.save(location);
      }
      if (this.maps[location.map]) {
        this.maps[location.map].scene.addPlayer(character.id, character.name, location.x, location.y);
        return location;
      }
    }
    return null;
  }

  async onLeave(characterId: number) {
    let location = await this.repo.findOne({ where: { characterId: characterId } });
    if (location) {
      if (this.maps[location.map]) {
        location.online = false;
        if (this.maps[location.map].scene.playerById[characterId]) {
          this.maps[location.map].scene.removePlayer(this.maps[location.map].scene.playerById[characterId].name);
        }
        await this.repo.save(location);
        return location;
      }
    }
    return null;
  }

  async onChange(characterId: number) {
    let location = await this.repo.findOne({ where: { characterId: characterId } });
    if (location) {
      let player = this.maps[location.map].scene.playerById[characterId];
      if (player) {
        let from       = this.maps[location.map].scene;
        let transition = from.transitions.find(transition => transition.x === player.x && transition.y === player.y);
        if (transition && this.maps[transition.key]) {
          let to      = this.maps[transition.key].scene;
          let landing = to.transitions.find(landing => landing.key === location.map && landing.id === transition.id);
          if (landing) {
            location.map    = landing.key;
            location.x      = landing.x;
            location.y      = landing.y;
            location.online = true;
            await this.repo.save(location);
            from.removePlayer(player.name);
            to.addPlayer(player.id, player.name, landing.x, landing.y);
            return { from: from.key, to: to.key };
          }
        }
      }
    }
    return null;
  }

  async onMove(characterId: number, destination: [number, number]) {
    let location = await this.repo.findOne({ where: { characterId: characterId } });
    if (location) {
      let map    = this.maps[location.map].scene;
      let player = map.playerById[characterId];
      if (player) {
        await player.movement.findPath(destination[0], destination[1]);
        return player.movement.path;
      }
    }
    return null;
  }
}
