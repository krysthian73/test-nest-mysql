import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksRepository } from './repositories/tasks.repository';
import { TaskFilter } from './types';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksRepository.create(createTaskDto);
  }

  async findAll(query?: TaskFilter): Promise<Task[]> {
    return await this.tasksRepository.findBy(query);
  }

  async findOne(id: number): Promise<Task | null> {
    return await this.tasksRepository.findOneBy({ id });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.tasksRepository.update(id, updateTaskDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}
