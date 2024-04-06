import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
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
    status: HttpStatus.OK,
    type: ResultType<AuthResultDto>,
  })
  @ApiResponse({
    description: 'Bad request',
    status: HttpStatus.BAD_REQUEST,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
    type: ResultType,
  })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinDto: SigninDto): Promise<ResultType<AuthResultDto>> {
    return this.authService.signIn(signinDto);
  }

  @ApiBody({ type: SignupDto })
  @ApiResponse({
    description: 'Method to sign user up',
    status: HttpStatus.CREATED,
    type: ResultType<AuthResultDto>,
  })
  @ApiResponse({
    description: 'Bad request',
    status: HttpStatus.BAD_REQUEST,
    type: ResultType,
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto): Promise<ResultType<AuthResultDto>> {
    return this.authService.signup(signupDto);
  }
}
