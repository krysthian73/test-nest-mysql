import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ResultType } from './types';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ResultType(
        HttpStatus.UNAUTHORIZED,
        ['Token not found'],
        'Unauthorized',
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      request['userId'] = payload['userId'];
      request['userRole'] = payload['role'];
      const userExists = await this.usersService.checkIfUserExists({
        id: parseInt(payload['userId']),
      });
      if (!userExists) {
        throw new ResultType(
          HttpStatus.UNAUTHORIZED,
          ['User not found'],
          'Unauthorized',
        );
      }
    } catch {
      throw new ResultType(
        HttpStatus.UNAUTHORIZED,
        ['Unknow token'],
        'Unauthorized',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
