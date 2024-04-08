import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksRepository } from './repositories/tasks.repository';
import { TaskFilter, TaskStatus } from './types';
import { ResultType } from '../types';
import { Role } from '../users/types';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    return this.tasksRepository.save({
      ...createTaskDto,
      ...{ userId },
    });
  }

  async findAll(query?: TaskFilter): Promise<Task[]> {
    return await this.tasksRepository.findBy(query);
  }

  async findOne(
    id: number,
    userId: number,
    userRole: Role,
  ): Promise<Task | null> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new ResultType(
        HttpStatus.NOT_FOUND,
        ['Task not found'],
        'Not found',
      );
    }
    if (task.userId !== userId && userRole !== Role.Admin) {
      throw new ResultType(
        HttpStatus.UNAUTHORIZED,
        ['You are not authorized to get this task'],
        'Unauthorized',
      );
    }
    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
    userRole: Role,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new ResultType(
        HttpStatus.NOT_FOUND,
        ['Task not found'],
        'Not found',
      );
    }
    if (
      (task.userId !== userId && userRole !== Role.Admin) ||
      task.status === TaskStatus.Completed
    ) {
      throw new ResultType(
        HttpStatus.FORBIDDEN,
        ['You are not allowed to update this task'],
        'Forbidden',
      );
    }
    await this.tasksRepository.update(id, updateTaskDto);
    return await this.tasksRepository.findOneBy({ id });
  }

  async remove(id: number, userId: number, userRole: Role): Promise<void> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new ResultType(
        HttpStatus.NOT_FOUND,
        ['Task not found'],
        'Not found',
      );
    }
    if (
      (task.userId !== userId && userRole !== Role.Admin) ||
      task.status === TaskStatus.Completed
    ) {
      throw new ResultType(
        HttpStatus.FORBIDDEN,
        ['You are not allowed to delete this task'],
        'Forbidden',
      );
    }
    await this.tasksRepository.delete(id);
  }
}
