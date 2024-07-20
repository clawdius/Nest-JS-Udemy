import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsCreateDto } from './dto/auth-credentials-create.dto';
import { AuthCredentialsLoginDto } from './dto/auth-credentials-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtContent } from './jwt-content.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsCreateDto: AuthCredentialsCreateDto,
  ): Promise<void> {
    const { username, password } = authCredentialsCreateDto;

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

  async signIn(
    authCredentialsDto: AuthCredentialsLoginDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.UsersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const content: JwtContent = { username };
      const accessToken: string = await this.jwtService.sign(content);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your credential');
    }
  }
}
