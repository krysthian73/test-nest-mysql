import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './modules/database/database.module';
import { ThrottlerModule } from './modules/throttler/throttler.module';

@Module({
  imports: [DatabaseModule, ThrottlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
