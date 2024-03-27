import { Injectable } from '@nestjs/common';
import { JwtOptionsFactory, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor() {}
  public createJwtOptions(): JwtSignOptions {
    return {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
    };
  }

  public createJwtRefreshToken(): JwtSignOptions {
    return {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
    };
  }
}
