import { Controller }                                from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { EventGateway }                              from './event.gateway';
import { SessionHandler }                            from './handlers/session.handler';

@Controller('dispatch')
export class EventController {

  constructor(private gateway: EventGateway, private client: ClientProxy) {
  }

  @EventPattern('emit.broadcast')
  broadcast({ event, data }: { event: string, data: any }) {
    this.gateway.server.emit(event, data);
  }

  @EventPattern('emit.to')
  room({ event, id, data }: { event: string, id: string, data: any }) {
    this.gateway.server.to(id).emit(event, data);
    if (event.indexOf('session.') === 0) {
      const session = new SessionHandler(this.gateway.server);
      session.handleEmitBehavior({ event, data });
    }
  }

  @MessagePattern('request.test')
  testMessage({ event, data }: { event: string, data: any }) {
    if (event === 'test') {
      console.log('Test Message Received', data);
    }
    return { result: 'ok' };
  }

  @EventPattern('emit.test')
  testEvent({ event, data }: { event: string, data: any }) {
    if (event === 'test') {
      console.log('Test Event Received', data);
      this.client.emit('event.broadcast', {
        event: 'test',
        data : 'side effect',
      });
    }
  }
}
