import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFullDto } from './dto/task-full.dto';
import { AuthGuard } from '../auth.guard';
import { ResultType } from '../types';
import { request } from 'http';

@ApiTags('tasks')
@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Task created successfully',
    status: HttpStatus.OK,
    type: ResultType<TaskFullDto>,
  })
  @ApiResponse({
    description: 'Bad request',
    status: HttpStatus.BAD_REQUEST,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
    type: ResultType,
  })
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: Request,
  ): Promise<ResultType<TaskFullDto>> {
    const newTask = await this.tasksService.create(
      createTaskDto,
      parseInt(request['userId']),
    );
    return new ResultType<TaskFullDto>(
      HttpStatus.OK,
      [],
      '',
      new TaskFullDto(newTask),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Task found successfully',
    status: HttpStatus.OK,
    type: ResultType<TaskFullDto>,
  })
  @ApiResponse({
    description: 'Task not found',
    status: HttpStatus.NOT_FOUND,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
    type: ResultType,
  })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<ResultType<TaskFullDto>> {
    const task = await this.tasksService.findOne(
      +id,
      parseInt(request['userId']),
      request['role'],
    );
    if (!task) {
      return new ResultType(HttpStatus.NOT_FOUND, [], 'Task not found');
    }
    if (task.userId !== parseInt(request['userId'])) {
      return new ResultType(HttpStatus.UNAUTHORIZED, [], 'Unauthorized');
    }
    return new ResultType(HttpStatus.OK, [], '', new TaskFullDto(task));
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Task updated successfully',
    status: HttpStatus.OK,
    type: ResultType<TaskFullDto[]>,
  })
  @ApiResponse({
    description: 'Bad request',
    status: HttpStatus.BAD_REQUEST,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Not allowed to update this task',
    status: HttpStatus.FORBIDDEN,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Task not found',
    status: HttpStatus.NOT_FOUND,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
    type: ResultType,
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request: Request,
  ): Promise<ResultType<TaskFullDto>> {
    const task = await this.tasksService.update(
      +id,
      updateTaskDto,
      parseInt(request['userId']),
      request['role'],
    );
    if (!task) {
      return new ResultType(HttpStatus.NOT_FOUND, [], 'Task not found');
    }
    return new ResultType(HttpStatus.OK, [], '', new TaskFullDto(task));
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Task deleted successfully',
    status: HttpStatus.OK,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Task not found',
    status: HttpStatus.NOT_FOUND,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Not allowed to delete this task',
    status: HttpStatus.FORBIDDEN,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
    type: ResultType,
  })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<ResultType<null>> {
    await this.tasksService.remove(
      +id,
      parseInt(request['userId']),
      request['role'],
    );
    return new ResultType(HttpStatus.OK, [], 'Task deleted successfully');
  }
}
