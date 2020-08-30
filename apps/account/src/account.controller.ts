import { Controller, Get }                           from '@nestjs/common';
import { AccountRepo }                               from './account.repo';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { AuthService }                               from './auth.service';
import { CharacterRepo }                             from './character.repo';
import { CharacterModel }                            from '../../../game/src/models/character.model';

@Controller()
export class AccountController {
  constructor(
    private account: AccountRepo,
    private character: CharacterRepo,
    private auth: AuthService,
    private client: ClientProxy,
  ) {
    this.account.clearSocketIds().then();
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
    if (typeof result === 'object' && result.account) {
      this.client.emit('emit.to', { event: 'account.logged-in', id: requesterId, data: {} });
      return {
        token: this.auth.createToken(result.account),
      };
    }
    return result;
  }

  @MessagePattern('request.account.logout')
  async onLogout({ requesterId, data }: { requesterId: string, data: {} }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      this.client.emit('emit.to', { event: 'account.logged-out', id: requesterId, data: {} });
      this.client.emit('emit.map.logout', { accountId: account.id });
      return await this.account.logout(account.email);
    }
    return null;
  }

  @MessagePattern('request.account.verify')
  async onVerify({ requesterId, data }: { requesterId: string, data: { token: string } }) {
    let result = this.auth.verifyToken(data.token);
    if (result) {
      let account = await this.account.getAccountByEmail(result.email);
      if (await this.account.updateSocketId(account, requesterId)) {
        this.client.emit('emit.to', { event: 'account.logged-in', id: requesterId, data: {} });
        return result;
      }
    }
    this.client.emit('emit.to', { event:'account.logged-out', id: requesterId, data: {} });
    return false;
  }

  @MessagePattern('request.character.create')
  async onCreateCharacter({ requesterId, data }: { requesterId: string, data: CharacterModel }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      let result = await this.character.createCharacter(account, data);
      if (result) {
        let { name, hairColor, hairStyle, skinTone, gender, id, race } = result.character;
        return { id, name, gender, hairColor, hairStyle, skinTone, race } as CharacterModel;
      }
    }
    return false;
  }

  @MessagePattern('request.character.get')
  async onGetCharacters({ requesterId, data }: { requesterId: string, data: { id?: number } }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      if (data?.id) {
        let character = await this.character.getCharacterById(data.id);
        if (character) {
          let { name, hairColor, hairStyle, skinTone, gender, id, race } = character;
          return { id, name, gender, hairColor, hairStyle, skinTone, race, accountId: account.id } as CharacterModel;
        }
        return null;
      }
      return (await this.character.getCharactersByAccount(account)).map(character => {
        let { name, hairColor, hairStyle, skinTone, gender, id, race } = character;
        return { id, name, gender, hairColor, hairStyle, skinTone, race, accountId: account.id } as CharacterModel;
      });
    }
    return [];
  }

  @MessagePattern('request.character.delete')
  async onDeleteCharacter({ requesterId, data }: { requesterId: string, data: { id: number } }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      let character = await this.character.findOne({ account, id: data.id });
      if (character) {
        await this.character.remove(character);
        return true;
      }
    }
    return false;
  }
}
