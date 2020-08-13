import { Controller, Get }                           from '@nestjs/common';
import { AccountRepo }                               from './account.repo';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { AuthService }                               from './auth.service';
import { CharacterRepo }                             from './character.repo';
import { CharacterModel }                            from '../../../lib/models/character.model';

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
  async onCreateCharacter({ requesterId, data }: { requesterId: string, data: CharacterModel }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      let result = await this.character.createCharacter(account, data);
      if (result) {
        this.client.emit('emit.to', { event: 'account.character-created', id: requesterId, data: {} });
        let { name, hairColor, hairStyle, skinTone, gender, id, race } = result.character;
        return { id, name, gender, hairColor, hairStyle, skinTone, race } as CharacterModel;
      }
    }
    return false;
  }

  @MessagePattern('request.character.get')
  async onGetCharacters({ requesterId, data }: { requesterId: string, data: {} }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      return (account.characters || []).map(character => {
        let { name, hairColor, hairStyle, skinTone, gender, id, race } = character;
        return { id, name, gender, hairColor, hairStyle, skinTone, race } as CharacterModel;
      });
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
