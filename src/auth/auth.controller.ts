import { Body, Controller, Post } from '@nestjs/common';
import { LoginCred, LoginRes } from './auth.model';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() user: LoginCred): LoginRes {
    return this.authService.login(user);
  }
}
