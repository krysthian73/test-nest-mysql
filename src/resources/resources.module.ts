import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [AuthModule, UsersModule, TasksModule],
  controllers: [],
  providers: [JwtService],
  exports: [],
})
export class ResoucesModule {}
