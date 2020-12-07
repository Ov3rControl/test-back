import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { UserRoles } from '../user.entity';

export class AuthCredentialsDTO {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(30) // To Prevent DDOS Attacks using hashing computation power
  password: string;

  role?: UserRoles;
}
