import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { RouterModule } from '@nestjs/core';
import { routes } from './routes';

@Module({
  imports: [UsersModule, RouterModule.register(routes)],
  controllers: [],
  providers: [JwtService],
  exports: [],
})
export class ResoucesModule {}
