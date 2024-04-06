import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { EntityDto } from '../../types';
import { User } from '../entities/user.entity';

export class UserFullDto extends EntityDto {
  constructor(user: User) {
    super();
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
  }

  @ApiProperty()
  @IsNotEmpty()
  @Length(0, 150)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6)
  password: string;
}
