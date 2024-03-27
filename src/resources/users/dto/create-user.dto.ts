import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(0, 150)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6)
  password: string;
}
