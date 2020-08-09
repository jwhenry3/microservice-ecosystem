import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt                                from 'bcryptjs';

@Entity()
export class AccountEntity {
  static salt = 'account';
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column() password: string;

  verify(hash: string) {
    return bcrypt.compareSync(hash, this.password);
  }

  setPassword(value: string) {
    this.password = bcrypt.hashSync(value, AccountEntity.salt);
  }
}
