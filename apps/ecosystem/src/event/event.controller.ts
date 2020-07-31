import { Controller }                        from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { EventGateway }                              from './event.gateway';

@Controller('dispatch')
export class EventController {

  constructor(private gateway: EventGateway,  private client: ClientProxy) {
  }

  @EventPattern('emit.event.broadcast')
  broadcast({ event, data }: { event: string, data: any }) {
    this.gateway.namespace.emit(event, data);
  }

  @EventPattern('emit.event.to')
  room({ event, room, data }: { event: string, room: string, data: any }) {
    this.gateway.namespace.to(room).emit(event, data);
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
