import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket }                                                           from 'socket.io';
import { ClientProxy }                                                              from '@nestjs/microservices';
import { SessionHandler }                                                           from './handlers/session.handler';

@WebSocketGateway()
export class EventGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  session = new SessionHandler(this.server);

  constructor(private client: ClientProxy) {

  }

  @SubscribeMessage('request')
  async request(client: Socket, payload: { event: string, data: any, requesterId?: string }) {
    if (payload.event && payload.data) {
      payload      = {
        ...payload,
        requesterId: client.id,
      };
      const result = await this.client.send('request.' + payload.event, payload).toPromise();
      this.session.handleRequestBehavior(client, payload, result);
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

  async handleDisconnect(client: Socket) {
    console.log('logout!');
    await this.client.send('request.account.logout', { requesterId: client.id }).toPromise();
  }


}
