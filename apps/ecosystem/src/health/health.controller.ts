import { Controller, Get, Inject } from '@nestjs/common';
import {
  DNSHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
}                                  from '@nestjs/terminus';
import {
  ClientProxy,
}                                  from '@nestjs/microservices';
import { takeUntil }               from 'rxjs/operators';
import { Subject }                 from 'rxjs';


@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private client: ClientProxy,
    private microservice: MicroserviceHealthIndicator,
    private dns: DNSHealthIndicator,
  ) {
  }

  checkMicroservice(name: string): Promise<HealthIndicatorResult> {
    return new Promise(resolve => {
      const stop                          = new Subject();
      let timeout                         = setTimeout(() => {
        stop.next();
      }, 500);
      const result: HealthIndicatorResult = {
        [name]: { status: 'down' },
      };
      this.client.send('health.' + name, {}).pipe(takeUntil(stop))
          .subscribe({
            next    : () => {
              clearTimeout(timeout);
              result[name].status = 'up';
            },
            complete: () => {
              resolve(result);
            },
          });
    });
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      ...(process.env.ALL_IN_ONE ? [] : [() => this.checkMicroservice('AUTH_SERVICE'),
                                         () => this.checkMicroservice('ACCOUNT_SERVICE'),
                                         () => this.checkMicroservice('PRESENCE_SERVICE'),
                                         () => this.checkMicroservice('STATE_SERVICE')]),
      () => this.dns.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
