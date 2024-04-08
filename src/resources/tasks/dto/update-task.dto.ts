import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsDate } from 'class-validator';
import { TaskStatus } from '../types';

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.Pending })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
