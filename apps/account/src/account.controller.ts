import { Controller, Get }                           from '@nestjs/common';
import { AccountRepo }                               from './account.repo';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { AuthService }                               from './auth.service';
import { CharacterRepo }                             from './character.repo';

@Controller()
export class AccountController {
  constructor(
    private account: AccountRepo,
    private character: CharacterRepo,
    private auth: AuthService,
    private client: ClientProxy,
  ) {
  }

  @MessagePattern('request.account.register')
  async onRegister({ requesterId, data }: { requesterId: string, data: { email: string, password: string } }) {
    let result = await this.account.register(data.email, data.password, requesterId);
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
    let result = await this.account.login(data.email, data.password, requesterId);
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
    await this.account.logout(data.email);
  }

  @MessagePattern('request.account.verify')
  onVerify({ requesterId, data }: { requesterId: string, data: { token: string } }) {
    let result = this.auth.verifyToken(data.token);
    if (result) {
      this.client.emit('emit.to', { event: 'account.logged-in', id: requesterId, data: {} });
    }
    return result;
  }

  @MessagePattern('request.character.create')
  async onCreateCharacter({ requesterId, data }: { requesterId: string, data: { name: string, sprite: string } }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      let result = await this.character.createCharacter(account, data.name, data.sprite);
      if (result) {
        this.client.emit('emit.to', { event: 'account.character-created', id: requesterId, data: {} });
        return {
          id    : result.character.id,
          name  : result.character.name,
          sprite: result.character.sprite,
        };
      }
    }
    return false;
  }

  @MessagePattern('request.character.get')
  async onGetCharacters({ requesterId, data }: { requesterId: string, data: {} }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      return account.characters.map(character => ({
        id    : character.id,
        name  : character.name,
        sprite: character.sprite,
      }));
    }
    return [];
  }

  @MessagePattern('request.character.delete')
  async onDeleteCharacter({ requesterId, data }: { requesterId: string, data: { name: string } }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      let character = account.characters.find(character => character.name === data.name);
      if (character) {
        await this.character.remove(character);
        return true;
      }
    }
    return false;
  }
}
