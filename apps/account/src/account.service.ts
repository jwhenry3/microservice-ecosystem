import { AccountEntity }                from './entities/account.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AccountEntity)
export class AccountService extends Repository<AccountEntity> {

  async getAccountByEmail(email: string) {
    
    return await this.findOne({
      where: { email },
    });
  }
}
