import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Namespace }                                           from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  namespace:Namespace;

  @SubscribeMessage('presence.*')
  presence(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('account.*')
  account(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('auth.*')
  auth(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('state.*')
  state(client: any, payload: any): string {
    return 'Hello world!';
  }
}
