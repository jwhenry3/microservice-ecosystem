import connect from 'socket.io-client';

export class SocketClient {

  static token: string = '';
  static email: string = '';
  static character: {
    id: number | null,
    name: string,
    sprite: string
  }                    = {
    id    : null,
    name  : '',
    sprite: '',
  };

  static socket: SocketIOClient.Socket = connect('ws://localhost:3000');

  static reconnect() {
    SocketClient.socket.connect();
  }
}
