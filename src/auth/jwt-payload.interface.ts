import { UserRoles } from './user.entity';

export interface JwtPayload {
  username: string;
  role: UserRoles;
}
