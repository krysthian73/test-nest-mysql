import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { AuthResultDto } from './dto/auth-result.dto';
import { SignupDto } from './dto/signup-dto';
import { ResultError, ResultSuccess } from '../types';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SigninDto })
  @ApiResponse({
    description: 'Method to log user in',
    status: 200,
    type: ResultSuccess<AuthResultDto>,
  })
  @ApiResponse({
    description: 'Bad request',
    status: 400,
    type: ResultError,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: 401,
    type: ResultError,
  })
  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signIn(signinDto);
  }

  @ApiBody({ type: SignupDto })
  @ApiResponse({
    description: 'Method to sign user up',
    status: 201,
    type: ResultSuccess<AuthResultDto>,
  })
  @ApiResponse({
    description: 'Bad request',
    status: 400,
    type: ResultError,
  })
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
