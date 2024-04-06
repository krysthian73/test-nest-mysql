import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { AuthResultDto } from './dto/auth-result.dto';
import { SignupDto } from './dto/signup-dto';
import { ResultType } from '../types';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SigninDto })
  @ApiResponse({
    description: 'User logged in successfully',
    status: 200,
    type: ResultType<AuthResultDto>,
  })
  @ApiResponse({
    description: 'Bad request',
    status: 400,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: 401,
    type: ResultType,
  })
  @Post('signin')
  @HttpCode(200)
  signin(@Body() signinDto: SigninDto): Promise<ResultType<AuthResultDto>> {
    return this.authService.signIn(signinDto);
  }

  @ApiBody({ type: SignupDto })
  @ApiResponse({
    description: 'Method to sign user up',
    status: 201,
    type: ResultType<AuthResultDto>,
  })
  @ApiResponse({
    description: 'Bad request',
    status: 400,
    type: ResultType,
  })
  @Post('signup')
  @HttpCode(201)
  signup(@Body() signupDto: SignupDto): Promise<ResultType<AuthResultDto>> {
    return this.authService.signup(signupDto);
  }
}
