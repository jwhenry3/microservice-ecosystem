import { Controller }   from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppGateway }   from '../app.gateway';

@Controller('dispatch')
export class EventController {

  constructor(private gateway: AppGateway) {
  }

  @EventPattern('presence.*')
  presence({ event, data }: { event: string, data: any }) {
    this.gateway.namespace.emit(event, data);
  }

  @EventPattern('auth.*')
  auth({ event, data }: { event: string, data: any }) {
    this.gateway.namespace.emit(event, data);
  }

  @EventPattern('account.*')
  account({ event, data }: { event: string, data: any }) {
    this.gateway.namespace.emit(event, data);
  }

  @EventPattern('state.*')
  state({ event, data }: { event: string, data: any }) {
    this.gateway.namespace.emit(event, data);
  }
}
