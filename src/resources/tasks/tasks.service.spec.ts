import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './repositories/tasks.repository';
import { HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { Role } from '../users/types';
import { TaskStatus } from './types';

class TasksRepositoryMock {
  private tasks: Task[] = [];

  async save(task: Task): Promise<Task> {
    task.id = Math.random();
    task.createdAt = new Date();
    task.status = TaskStatus.Pending;
    this.tasks.push(task);
    return task;
  }

  async findOneBy(options: any): Promise<Task | null> {
    return this.tasks.find((t) => t.id === options.id) || null;
  }

  async delete(id: number): Promise<void> {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}

describe('TasksService', () => {
  let service: TasksService;
  const USER_ID = 1;
  const TASK_ID_INEXISTENT = 999;
  const USER_ID_UNAUTHORIZED = 2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useClass: TasksRepositoryMock },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const userId = USER_ID;
      const createdTask = await service.create(createTaskDto, userId);
      expect(createdTask).toBeDefined();
      expect(createdTask.id).toBeDefined();
      expect(createdTask.title).toEqual(createTaskDto.title);
      expect(createdTask.description).toEqual(createTaskDto.description);
      expect(createdTask.userId).toEqual(userId);
    });
  });

  describe('findOne', () => {
    it('should find an existing task by ID', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const userId = USER_ID;
      const createdTask = await service.create(createTaskDto, userId);
      const foundTask = await service.findOne(
        createdTask.id,
        userId,
        Role.Admin,
      );
      expect(foundTask).toBeDefined();
      expect(foundTask.id).toEqual(createdTask.id);
      expect(foundTask.title).toEqual(createdTask.title);
      expect(foundTask.description).toEqual(createdTask.description);
      expect(foundTask.userId).toEqual(userId);
    });

    it('should return null if task does not exist', async () => {
      const taskId = TASK_ID_INEXISTENT;
      const userId = USER_ID;
      try {
        await service.findOne(taskId, userId, Role.Admin);
      } catch (error) {
        expect(error.statusCode).toEqual(HttpStatus.NOT_FOUND);
        expect(error.message).toContain('Task not found');
        expect(error.error).toContain('Not found');
      }
    });

    it('should throw an error if user is not authorized', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const userId = USER_ID;
      const createdTask = await service.create(createTaskDto, userId);
      const unauthorizedUserId = USER_ID_UNAUTHORIZED;
      try {
        await service.findOne(createdTask.id, unauthorizedUserId, Role.User);
      } catch (error) {
        expect(error.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        expect(error.message).toContain(
          'You are not authorized to get this task',
        );
        expect(error.error).toContain('Unauthorized');
      }
    });
  });

  describe('remove', () => {
    it('should remove an existing task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const userId = USER_ID;
      const createdTask = await service.create(createTaskDto, userId);
      await service.remove(createdTask.id, userId, Role.Admin);
      try {
        await service.findOne(createdTask.id, userId, Role.Admin);
      } catch (error) {
        expect(error.statusCode).toEqual(HttpStatus.NOT_FOUND);
        expect(error.message).toContain('Task not found');
        expect(error.error).toContain('Not found');
      }
    });

    it('should throw an error if task does not exist', async () => {
      const taskId = TASK_ID_INEXISTENT;
      const userId = USER_ID;
      try {
        await service.remove(taskId, userId, Role.Admin);
      } catch (error) {
        expect(error.statusCode).toEqual(HttpStatus.NOT_FOUND);
        expect(error.message).toContain('Task not found');
        expect(error.error).toContain('Not found');
      }
    });

    it('should throw an error if user is not authorized', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const userId = USER_ID;
      const createdTask = await service.create(createTaskDto, userId);
      const unauthorizedUserId = USER_ID_UNAUTHORIZED;
      try {
        await service.remove(createdTask.id, unauthorizedUserId, Role.User);
      } catch (error) {
        expect(error.statusCode).toEqual(HttpStatus.FORBIDDEN);
        expect(error.message).toContain('You are not allowed to delete this task');
        expect(error.error).toContain('Forbidden');
      }
    });
  });
});
