import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from './modules/config-env/config-env.module';
import { DatabaseModule } from './modules/database/database.module';
import { ThrottlerModule } from './modules/throttler/throttler.module';
import { JwtModule } from './modules/jwt/jwt.module';

@Module({
  imports: [ConfigModule, DatabaseModule, JwtModule, ThrottlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
