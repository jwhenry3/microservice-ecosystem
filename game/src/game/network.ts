import io               from 'socket.io-client';
import { AuthNet }      from './net/auth.net';
import { Net }          from './net/net';
import { CharacterNet } from './net/character.net';
import { MapNet }       from './net/map.net';

export class Network {

  net       = new Net(io('ws://localhost:3000'));
  auth      = new AuthNet(this.net);
  character = new CharacterNet(this.net);
  map       = new MapNet(this.net);

}
