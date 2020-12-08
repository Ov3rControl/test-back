import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from './user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, public jwtService: JwtService) {}
  //*TODO* Refactor to take role from request object directly
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const Token = request.headers.authorization?.split(' ')[1];
    const User: any = this.jwtService.decode(Token);
    if (User === null) {
      throw new UnauthorizedException();
    }
    return roles.includes(User.role);
  }
}
