import { Controller, Get }                           from '@nestjs/common';
import { AccountRepo }                               from './account.repo';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { AuthService }                               from './auth.service';
import { CharacterRepo }                             from './character.repo';
import { CharacterModel }                            from '../../../game/src/models/character.model';
import { CONSTANTS }                                 from '../../../game/src/lib/constants';

@Controller()
export class AccountController {
  constructor(
    private account: AccountRepo,
    private character: CharacterRepo,
    private auth: AuthService,
    private client: ClientProxy,
  ) {
  }

  @MessagePattern('request.' + CONSTANTS.REGISTER)
  async onRegister({ requesterId, data }: { requesterId: string, data: { email: string, password: string } }) {
    let result = await this.account.register(data.email, data.password, requesterId);
    if (result) {
      this.client.emit('emit.to', { event: CONSTANTS.LOGGED_IN, id: requesterId, data: {} });
      return {
        token: this.auth.createToken(result.account),
      };
    }
    return false;
  }

  @MessagePattern('request.' + CONSTANTS.LOGIN)
  async onLogin({ requesterId, data }: { requesterId: string, data: { email: string, password: string } }) {
    let result = await this.account.login(data.email, data.password, requesterId);
    if (result) {
      this.client.emit('emit.to', { event: CONSTANTS.LOGGED_IN, id: requesterId, data: {} });
      return {
        token: this.auth.createToken(result.account),
      };
    }
    return false;
  }

  @MessagePattern('request.' + CONSTANTS.LOGOUT)
  async onLogout({ requesterId, data }: { requesterId: string, data: {} }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      this.client.emit('emit.to', { event: CONSTANTS.LOGGED_OUT, id: requesterId, data: {} });
      return await this.account.logout(account.email);
    }
    return null;
  }

  @MessagePattern('request.' + CONSTANTS.VERIFY_ACCOUNT)
  async onVerify({ requesterId, data }: { requesterId: string, data: { token: string } }) {
    let result = this.auth.verifyToken(data.token);
    if (result) {
      let account = await this.account.getAccountByEmail(result.email);
      if (await this.account.updateSocketId(account, requesterId)) {
        this.client.emit('emit.to', { event: CONSTANTS.LOGGED_IN, id: requesterId, data: {} });
        return result;
      }
    }
    this.client.emit('emit.to', { event: CONSTANTS.LOGGED_OUT, id: requesterId, data: {} });
    return false;
  }

  @MessagePattern('request.' + CONSTANTS.CREATE_CHARACTER)
  async onCreateCharacter({ requesterId, data }: { requesterId: string, data: CharacterModel }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      let result = await this.character.createCharacter(account, data);
      if (result) {
        this.client.emit('emit.to', { event: CONSTANTS.CHARACTER_CREATED, id: requesterId, data: {} });
        let { name, hairColor, hairStyle, skinTone, gender, id, race } = result.character;
        return { id, name, gender, hairColor, hairStyle, skinTone, race } as CharacterModel;
      }
    }
    return false;
  }

  @MessagePattern('request.' + CONSTANTS.GET_CHARACTERS)
  async onGetCharacters({ requesterId, data }: { requesterId: string, data: {} }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      return (await this.character.getCharactersByAccount(account)).map(character => {
        let { name, hairColor, hairStyle, skinTone, gender, id, race } = character;
        return { id, name, gender, hairColor, hairStyle, skinTone, race } as CharacterModel;
      });
    }
    return [];
  }

  @MessagePattern('request.' + CONSTANTS.SELECT_CHARACTER)
  async onSelectedCharacter({ requesterId, data }: { requesterId: string, data: { id: number | null } }) {
    let account = await this.account.getAccountBySocketId(requesterId);
    if (account) {
      if (!data.id || await this.character.findOne({ account, id: data.id })) {
        await this.account.selectCharacter(account, data.id);
        return true;
      }
    }
    return false;
  }

  @MessagePattern('request.' + CONSTANTS.DELETE_CHARACTER)
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
