import { CharacterJob }   from './character-job';
import { CharacterStats } from './character-stats';
import { EquipmentSlots } from './equipment-slots';
import { Ability }        from './ability';

export class Character {


  constructor(
    public id: number,
    public stats: CharacterStats,
    public job: CharacterJob,
    public equipment: EquipmentSlots,
    public abilities: { [name: string]: Ability }) {
  }
}
