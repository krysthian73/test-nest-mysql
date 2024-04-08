import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpStatus, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { SigninDto } from './dto/signin.dto';
import { AuthResultDto } from './dto/auth-result.dto';
import { SignupDto } from './dto/signup-dto';
import { ResultType } from '../types';
import { Role } from '../users/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signinDto: SigninDto): Promise<AuthResultDto> {
    const { email, password } = signinDto;
    const user = await this.usersService.findOne({ email });
    const passwordValidation = await bcrypt.compare(
      password,
      user?.password ?? '',
    );
    if (!user?.password || !passwordValidation) {
      throw new ResultType(HttpStatus.UNAUTHORIZED, [], 'Unauthorized');
    }

    const payload = { userId: user.id, role: user.role };

    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(signupDto: SignupDto): Promise<AuthResultDto> {
    const { email, password, name, role } = signupDto;
    const userExists = await this.usersService.checkIfUserExists({ email });
    if (userExists) {
      throw new ResultType(
        HttpStatus.BAD_REQUEST,
        ['User already exists'],
        'Bad Request',
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      role: role ?? Role.User,
    });

    const payload = { userId: user.id, role: user.role };

    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
