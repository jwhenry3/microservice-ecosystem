import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Namespace }                                           from 'socket.io';
import { ClientProxy }                                         from '@nestjs/microservices';

@WebSocketGateway()
export class EventGateway {
  @WebSocketServer()
  namespace: Namespace;

  constructor(private client: ClientProxy) {

  }

  @SubscribeMessage('request')
  async request(client: any, payload: { event: string, data: any }) {
    if (payload.event && payload.data) {
      return await this.client.send('request.' + payload.event, payload).toPromise();
    }
  }

  @SubscribeMessage('emit')
  emit(client: any, payload: { event: string, data: any }): any {
    if (payload.event && payload.data) {
      this.client.emit('emit.' + payload.event, payload);
    }
  }
}
