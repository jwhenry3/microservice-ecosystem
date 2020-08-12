import io          from 'socket.io-client';
import { AuthNet } from './net/auth.net';
import { Net }     from './net/net';

export class Network {

  net  = new Net(io('ws://localhost:3000'));
  auth = new AuthNet(this.net);

}
