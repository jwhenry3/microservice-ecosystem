import { AccountEntity }                from './entities/account.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AccountEntity)
export class AccountRepo extends Repository<AccountEntity> {


  async getAccountByEmail(email: string) {

    return await this.findOne({
      where: { email },
    });
  }

  async login(email: string, password: string, socketId: string) {
    let account = await this.getAccountByEmail(email);
    if (account) {
      if (account.verify(password)) {
        account.currentSocketId = socketId;
        await this.save(account, { reload: true });
        return { account };
      }
    }
    return null;
  }

  async register(email: string, password: string, socketId: string) {
    let result = await this.getAccountByEmail(email);
    if (!result) {
      let account   = new AccountEntity();
      account.email = email;
      account.setPassword(password);
      account.currentSocketId = socketId;
      await this.save(account, { reload: true });
      return { account };
    }
    return null;
  }

  async logout(email: string) {
    let account = await this.getAccountByEmail(email);
    if (account) {
      account.currentSocketId = null;
      await this.save(account, { reload: true });
      return { account };
    }
    return null;
  }
}
