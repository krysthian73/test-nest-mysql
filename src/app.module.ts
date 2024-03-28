import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config-env/config-env.module';
import { DatabaseModule } from './modules/database/database.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { ResoucesModule } from './resources/resources.module';
import { ThrottlerModule } from './modules/throttler/throttler.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    JwtModule,
    ResoucesModule,
    ThrottlerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
