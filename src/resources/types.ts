import { ApiProperty } from '@nestjs/swagger';

export class ResultError {
  constructor(message: Array<string>, statusCode: number, error: string) {
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
  }

  @ApiProperty()
  message: Array<string>;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;
}

export class ResultSuccess<T> {
  constructor(data: T, statusCode: number) {
    this.data = data;
    this.statusCode = statusCode;
  }

  @ApiProperty()
  data: T;

  @ApiProperty()
  statusCode: number;
}
