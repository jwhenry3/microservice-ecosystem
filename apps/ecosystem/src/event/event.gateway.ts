import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket }                                                           from 'socket.io';
import { ClientProxy }                                                              from '@nestjs/microservices';
import { SessionHandler }                                                           from './handlers/session.handler';

@WebSocketGateway()
export class EventGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private client: ClientProxy) {

  }

  @SubscribeMessage('request')
  async request(client: Socket, payload: { event: string, data: any, requesterId?: string }) {
    if (payload.event && payload.data) {
      payload = {
        ...payload,
        requesterId: client.id,
      };
      const result = await this.client.send('request.' + payload.event, payload).toPromise();
      if (payload.event?.indexOf('session.') === 0) {
        const session = new SessionHandler(this.server);
        session.handleRequestBehavior(client, payload, result);
      }
      return result;
    }
  }

  @SubscribeMessage('emit')
  emit(client: Socket, payload: { event: string, data: any, requesterId?: string }): any {
    if (payload.event && payload.data) {
      payload = {
        ...payload,
        requesterId: client.id,
      };
      this.client.emit('emit.' + payload.event, payload);
    }
  }

  handleDisconnect(client: Socket) {
    this.client.emit('emit.session.disconnect', { requesterId: client.id });
  }


}
