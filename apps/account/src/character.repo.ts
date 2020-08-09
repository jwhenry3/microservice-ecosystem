import { CharacterEntity }              from './entities/character.entity';
import { EntityRepository, Repository } from 'typeorm';
import { AccountEntity }                from './entities/account.entity';

@EntityRepository(CharacterEntity)
export class CharacterRepo extends Repository<CharacterEntity> {

  async getCharacterByName(name: string) {
    return await this.findOne({
      where: { name },
    });
  }

  async createCharacter(account: AccountEntity, name: string, sprite: string) {
    let result = await this.getCharacterByName(name);
    if (!result) {
      let character     = new CharacterEntity();
      character.name    = name;
      character.account = account;
      character.sprite  = sprite;
      await this.save(character, { reload: true });
      return {character};
    }
    return null;
  }
}
