import { AccountEntity } from './entities/account.entity';
import { JwtService }    from '@nestjs/jwt';
import { Injectable }    from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(private jwt: JwtService) {
  }

  createToken(account: AccountEntity) {
    return this.jwt.sign({
      id   : account.id,
      email: account.email,
    }, {
      secret: process.env.JWT_SECRET,
    });
  }

  verifyToken(token: string) {
    return this.jwt.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
