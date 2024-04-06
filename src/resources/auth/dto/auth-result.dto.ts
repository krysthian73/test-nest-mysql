import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/resources/users/entities/user.entity';

export class AuthResultDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  access_token: string;
}
