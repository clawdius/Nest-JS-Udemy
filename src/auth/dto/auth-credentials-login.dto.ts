import { IsNotEmpty } from 'class-validator';

export class AuthCredentialsLoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
