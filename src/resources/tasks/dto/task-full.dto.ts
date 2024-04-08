import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDate,
  IsNumber,
} from 'class-validator';
import { TaskStatus } from '../types';
import { EntityDto } from 'src/resources/types';

export class TaskFullDto extends EntityDto {
  constructor(partial: Partial<TaskFullDto>) {
    super();
    Object.assign(this, partial);
  }

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

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
