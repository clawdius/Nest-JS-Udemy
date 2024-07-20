import { Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsCreateDto } from './dto/auth-credentials-create.dto';
import { AuthCredentialsLoginDto } from './dto/auth-credentials-login.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body()
    authCredentialsCreateDto: AuthCredentialsCreateDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsCreateDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsLoginDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
