import { Injectable }       from '@nestjs/common';
import { Zone1Scene }       from '../../../game/src/game/scenes/server/world/zone-1.scene';
import { GameMap }          from '../../../game/src/game/scenes/server/game.map';
import { ClientProxy }      from '@nestjs/microservices';
import { Repository }       from 'typeorm';
import { LocationEntity }   from './entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CONSTANTS }        from '../../../game/src/lib/constants';
// set the fps you need
const FPS                 = 30;
global['phaserOnNodeFPS'] = FPS; // default is 60


@Injectable()
export class MapService {
  maps: { [key: string]: GameMap } = {};

  constructor(private client: ClientProxy, @InjectRepository(LocationEntity) private repo: Repository<LocationEntity>) {
  }

  start() {
    this.maps['zone-1'] = new GameMap('zone-1', Zone1Scene);
  }

  async onJoined(characterId: number) {
    let character = await this.client.send('request.' + CONSTANTS.GET_CHARACTER, { id: characterId }).toPromise();
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
      this.maps[location.map].scene.addPlayer(character.id, character.name, location.x, location.y);
    }
  }

  async onLeft(characterId: number) {
    let location = await this.repo.findOne({ where: { characterId: characterId } });
    if (location) {
      location.online = false;
      if (this.maps[location.map].scene.playerById[characterId]) {
        this.maps[location.map].scene.removePlayer(this.maps[location.map].scene.playerById[characterId].name);
      }
      await this.repo.save(location);
    }
  }

  async onChanged(characterId: number, map: string) {
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
          }
        }
      }
    }
  }

  onMove(characterId: number, destination: [number, number]) {

  }
}
