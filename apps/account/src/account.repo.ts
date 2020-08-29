import { AccountEntity }                from './entities/account.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AccountEntity)
export class AccountRepo extends Repository<AccountEntity> {


  async clearSocketIds() {
    await this.createQueryBuilder().update(AccountEntity)
              .set({ currentSocketId: null })
              .execute();
  }

  async getAccountByEmail(email: string) {
    return await this.findOne({
      where: { email },
    });
  }

  async getAccountBySocketId(socketId: string) {
    return await this.findOne({
      where: { currentSocketId: socketId },
    });
  }

  async login(email: string, password: string, socketId: string): Promise<{ account: AccountEntity } | 'logged-in' | 'not-found'> {
    let account = await this.getAccountByEmail(email);
    if (account) {
      console.log(account);
      if (account.verify(password)) {
        if (!account.currentSocketId) {
          account.currentSocketId = socketId;
          await this.save(account, { reload: true });
          return { account };
        } else {
          return 'logged-in';
        }
      }
    }
    return 'not-found';
  }

  async updateSocketId(account: AccountEntity, socketId: string) {
    account.currentSocketId = socketId;
    await this.save(account, { reload: true });
    return { account };
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
