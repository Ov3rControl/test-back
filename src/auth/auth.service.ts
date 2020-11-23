import { Injectable } from '@nestjs/common';
import { LoginCred, LoginRes } from './auth.model';

@Injectable()
export class AuthService {
  login(body: LoginCred): LoginRes {
    if (body.username === 'admin' && body.password === 'admin')
      return { role: 'admin', auth: true, token: 'UglyStaticAdminToken' };
    else if (body.username === 'user' && body.password === 'user')
      return { role: 'user', auth: true, token: 'UglyStaticUserToken' };
    else return { auth: false };
  }
}
