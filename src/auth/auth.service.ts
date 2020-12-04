import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginCred, LoginRes } from './auth.model';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(authCredentialsDTO);
  }

  async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<any> {
    const username = this.userRepository.validateUserPassword(
      authCredentialsDTO,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  login(body: LoginCred): LoginRes {
    if (body.username === 'admin' && body.password === 'admin')
      return { role: 'admin', auth: true, token: 'UglyStaticAdminToken' };
    else if (body.username === 'user' && body.password === 'user')
      return { role: 'user', auth: true, token: 'UglyStaticUserToken' };
    else return { auth: false };
  }
}
