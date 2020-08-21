import { Net }            from './net';
import { CharacterModel } from '../../models/character.model';

export class CharacterNet {

  constructor(private net: Net) {
  }

  getCharacters() {
    return this.net.request<CharacterModel[]>('character.get', {});
  }

  createCharacter(character: CharacterModel) {
    return this.net.request('character.create', character);
  }

  deleteCharacter(character: CharacterModel) {
    return this.net.request('character.delete', { id: character.id });
  }

  selectCharacter(character: CharacterModel) {
    return this.net.request('character.select', { id: character.id });
  }

  removeCharacter() {
    return this.net.request('character.select', { id: null });
  }
}
