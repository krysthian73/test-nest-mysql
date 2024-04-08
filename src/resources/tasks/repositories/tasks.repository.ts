import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../entities/task.entity';
import { TaskFilter } from '../types';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task)
    private readonly usersRepository: Repository<Task>,
  ) {
    super(
      usersRepository.target,
      usersRepository.manager,
      usersRepository.queryRunner,
    );
  }

  async checkIfTaskExists(query: TaskFilter): Promise<boolean> {
    const count = await this.usersRepository.count({ where: query });
    return count > 0;
  }
}
