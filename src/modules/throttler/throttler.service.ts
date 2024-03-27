import { Injectable } from '@nestjs/common';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export class ThrottlerService implements ThrottlerOptionsFactory {
  constructor() {}
  public createThrottlerOptions(): ThrottlerModuleOptions {
    const limitShort = parseInt(process.env.THROTTLE_LIMIT_SHORT);
    const ttlShort = parseInt(process.env.THROTTLE_TTL_SHORT);
    const limitMedium = parseInt(process.env.THROTTLE_LIMIT_MEDIUM);
    const ttlMedium = parseInt(process.env.THROTTLE_TTL_MEDIUM);
    const limitLong = parseInt(process.env.THROTTLE_LIMIT_LONG);
    const ttlLong = parseInt(process.env.THROTTLE_TTL_LONG);

    return [
      {
        name: 'short',
        ttl: ttlShort,
        limit: limitShort,
      },
      {
        name: 'medium',
        ttl: ttlMedium,
        limit: limitMedium,
      },
      {
        name: 'long',
        ttl: ttlLong,
        limit: limitLong,
      },
    ];
  }
}
