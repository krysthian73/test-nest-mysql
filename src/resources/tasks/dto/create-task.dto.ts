import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsDate } from 'class-validator';
import { TaskStatus } from '../types';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;
}
