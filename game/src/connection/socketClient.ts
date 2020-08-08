import connect from 'socket.io-client';

export class SocketClient {

  static socket: SocketIOClient.Socket = connect('ws://localhost:3000');

  static reconnect() {
    SocketClient.socket.connect();
  }
}
