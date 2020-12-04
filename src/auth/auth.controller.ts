import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { LoginCred, LoginRes } from './auth.model';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO) {
    return this.authService.signUp(authCredentialsDTO);
  }

  @Post()
  login(@Body() user: LoginCred): LoginRes {
    return this.authService.login(user);
  }
}
