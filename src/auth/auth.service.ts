import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);

    const user = this.UsersRepository.create({
      username,
      password: hashed,
    });

    try {
      await this.UsersRepository.insert(user);
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate uname
        throw new ConflictException('Username already exists, my guy.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
