import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    public repository: Repository<User>,
  ) {}
}

export type UsersRepositoryType = Repository<User>;
