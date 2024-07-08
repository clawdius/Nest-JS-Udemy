import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  /*  @MinLength(8)
      @MaxLength(32)
      @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'Your password is too weak, my guy',
      })
  Passwords will contain at least 1 upper case letter
  Passwords will contain at least 1 lower case letter
  Passwords will contain at least 1 number or special character

  UPDATE: Temporarily disabled this constraint, because a user can get the "password is too weak" message whenever a user is trying
  to login with one of the constraints violated (ex no lower cases), this should haven't happened when a user is trying to sign in.

  The ideal workflow is to enable this ONLY for signup, I might try to solve this in the foreseeable future.
  */
  password: string;
}
