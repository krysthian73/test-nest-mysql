import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { SigninDto } from './dto/signin.dto';
import { AuthResultDto } from './dto/auth-result.dto';
import { SignupDto } from './dto/signup-dto';
import { ResultError, ResultSuccess } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signinDto: SigninDto): Promise<ResultSuccess<AuthResultDto>> {
    const { email, password } = signinDto;
    const user = await this.usersService.findOne({ email });
    const passwordValidation = await bcrypt.compare(
      password,
      user?.password ?? '',
    );
    if (!user?.password || !passwordValidation) {
      throw new ResultError([], 401, 'Unauthorized');
    }

    const payload = { userId: user.id };

    return {
      data: {
        user,
        access_token: await this.jwtService.signAsync(payload),
      },
      statusCode: 200,
    };
  }

  async signup(signupDto: SignupDto): Promise<ResultSuccess<AuthResultDto>> {
    const { email, password, name } = signupDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
    });

    const payload = { userId: user.id };

    return {
      data: {
        user,
        access_token: await this.jwtService.signAsync(payload),
      },
      statusCode: 201,
    };
  }
}
