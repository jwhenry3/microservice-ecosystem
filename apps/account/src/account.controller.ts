import { Controller, Get }                           from '@nestjs/common';
import { AccountRepo }                               from './account.repo';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { AuthService }                               from './auth.service';

@Controller()
export class AccountController {
  constructor(
    private repo: AccountRepo,
    private auth: AuthService,
    private client: ClientProxy,
  ) {
  }

  @MessagePattern('request.account.register')
  async onRegister({ requesterId, data }: { requesterId: string, data: { email: string, password: string } }) {
    let result = await this.repo.register(data.email, data.password, requesterId);
    if (result) {
      this.client.emit('emit.to', { event: 'account.logged-in', id: requesterId, data: {} });
      return {
        token: this.auth.createToken(result.account),
      };
    }
    return false;
  }

  @MessagePattern('request.account.login')
  async onLogin({ requesterId, data }: { requesterId: string, data: { email: string, password: string } }) {
    let result = await this.repo.login(data.email, data.password, requesterId);
    if (result) {
      this.client.emit('emit.to', { event: 'account.logged-in', id: requesterId, data: {} });
      return {
        token: this.auth.createToken(result.account),
      };
    }
    return false;
  }

  @MessagePattern('request.account.logout')
  async onLogout({ requesterId, data }: { requesterId: string, data: { email: string } }) {
    this.client.emit('emit.to', { event: 'account.logged-out', id: requesterId, data: {} });
    await this.repo.logout(data.email);
  }

  @MessagePattern('request.account.verify')
  onVerify({ requesterId, data }: { requesterId: string, data: { token: string } }) {
    let result = this.auth.verifyToken(data.token);
    if (result) {
      this.client.emit('emit.to', { event: 'account.logged-in', id: requesterId, data: {} });
    }
    return result;
  }
}
