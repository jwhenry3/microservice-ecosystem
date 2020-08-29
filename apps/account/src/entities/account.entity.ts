import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt                                                   from 'bcryptjs';
import { CharacterEntity }                                           from './character.entity';

@Entity()
@Unique(['email'])
export class AccountEntity {
  static salt = 'account';
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  currentSocketId: string;
  @OneToMany(t => CharacterEntity, c => c.account)
  characters: CharacterEntity[];

  verify(value: string) {
    return bcrypt.compareSync(value, this.password);
  }

  setPassword(value: string) {
    this.password = bcrypt.hashSync(value);
  }
}
