import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt                                        from 'bcryptjs';

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
  @Column()
  currentSocketId: string;

  verify(value: string) {
    return bcrypt.compareSync(value, this.password);
  }

  setPassword(value: string) {
    this.password = bcrypt.hashSync(value);
  }
}
