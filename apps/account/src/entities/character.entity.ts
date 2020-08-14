import { AccountEntity }                                                               from './account.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CharacterModel }                                                              from '../../../../game/src/models/character.model';

@Entity()
@Unique(['name'])
export class CharacterEntity implements CharacterModel {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(t => AccountEntity, a => a.characters)
  account: AccountEntity;
  @Column()
  name: string;
  @Column()
  hairStyle: string;
  @Column()
  hairColor: string;
  @Column()
  race: string;
  @Column()
  gender: string;
  @Column()
  skinTone: string;
  @DeleteDateColumn()
  deletedAt: Date;
}
