import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';

export class TasksRepository extends Repository<Task> {}
