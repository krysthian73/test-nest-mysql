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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFullDto } from './dto/task-full.dto';
import { AuthGuard } from '../auth.guard';
import { ResultType } from '../types';

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
  ): Promise<ResultType<TaskFullDto>> {
    const newTask = await this.tasksService.create(createTaskDto);
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
  async findOne(@Param('id') id: string): Promise<ResultType<TaskFullDto>> {
    const task = await this.tasksService.findOne(+id);
    if (!task) {
      return new ResultType(HttpStatus.NOT_FOUND, [], 'Task not found');
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
  ): Promise<ResultType<TaskFullDto>> {
    const task = await this.tasksService.update(+id, updateTaskDto);
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
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
    type: ResultType,
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<ResultType<null>> {
    await this.tasksService.remove(+id);
    return new ResultType(HttpStatus.OK, [], 'Task deleted successfully');
  }
}
