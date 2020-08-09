import { AccountEntity }                                                               from './account.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class CharacterEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(t => AccountEntity, a => a.characters)
  account: AccountEntity;
  @Column()
  name: string;
  @Column()
  sprite: string;
  @DeleteDateColumn()
  deletedAt:Date;
}
