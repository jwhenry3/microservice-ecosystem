import { CharacterEntity }                  from './entities/character.entity';
import { EntityRepository, Repository }     from 'typeorm';
import { AccountEntity }                    from './entities/account.entity';
import { CHARACTER_FIELDS, CharacterModel } from '../../../game/src/models/character.model';

@EntityRepository(CharacterEntity)
export class CharacterRepo extends Repository<CharacterEntity> {

  async getCharactersByAccount(account: AccountEntity) {
    return await this.find({
      account,
    });
  }

  async getCharacterById(id: number) {
    return await this.findOne({
      where: { id },
    });
  }

  async getCharacterByName(name: string) {
    return await this.findOne({
      where: { name },
    });
  }

  async getCharacterToDelete(account: AccountEntity, name: string) {
    return await this.findOne({
      where: { account, name },
    });
  }


  async createCharacter(account: AccountEntity, model: CharacterModel) {
    let result = await this.getCharacterByName(model.name);
    if (!result) {
      let character = new CharacterEntity();
      for (let prop in model) {
        if (model.hasOwnProperty(prop)) {
          if (CHARACTER_FIELDS.includes(prop)) {
            character[prop] = model[prop];
          }
        }
      }
      character.account = account;
      await this.save(character, { reload: true });
      return { character };
    }
    return null;
  }
}
