import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.UsersRepository.create({
      username,
      password,
    });

    try {
      await this.UsersRepository.insert(user);
    } catch (error) {
      if (error.code === '23505') { // Duplicate uname
        throw new ConflictException('Username already exists, my guy.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
