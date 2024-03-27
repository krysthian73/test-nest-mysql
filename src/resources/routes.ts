import { Routes } from '@nestjs/core';
import { UsersModule } from './users/users.module';

export const routes: Routes = [{ path: '/users', module: UsersModule }];
