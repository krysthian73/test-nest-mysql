import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Length, IsEnum } from 'class-validator';
import { Role } from '../types';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(0, 150)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsEnum(Role)
  role?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6)
  password: string;
}
