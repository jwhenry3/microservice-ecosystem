export class Net {
  constructor(private socket: SocketIOClient.Socket) {
  }

  request<T>(event: string, data: any):Promise<T> {
    return new Promise(resolve => this.socket.emit('request', { event, data }, resolve));
  }

  emit(event: string, data: any) {
    this.socket.emit('emit', { event, data });
  }

  on(event: string, cb: (data: any) => void) {
    this.socket.on(event, cb);
  }
}
