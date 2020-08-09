import { Controller, Get } from '@nestjs/common';
import { AccountService }  from './account.service';
import { MessagePattern }  from '@nestjs/microservices';
import { Repository }       from 'typeorm';
import { AccountEntity }    from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller()
export class AppController {
  constructor(
    private service: AccountService
  ) {
  }

  @MessagePattern('request.account.register')
  async onRegister(data: { email: string, password: string }) {
    console.log(data);
    let result = await this.service.getAccountByEmail(data.email);
    if (!result) {
      console.log('You can register');
      return true;
    }
    return false;
  }

  @MessagePattern('request.account.login')
  async onLogin(data: { email: string, password: string }) {
    console.log(data);
    let result = await this.service.getAccountByEmail(data.email);
    if (result) {
      console.log('You can login', result);
      return true;
    }
    return false;
  }
}
