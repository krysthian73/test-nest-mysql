import { ApiProperty } from '@nestjs/swagger';

export class ResultType<T> {
  constructor(
    statusCode: number,
    message?: Array<string>,
    error?: string,
    data?: T | Array<T>,
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.error = error;
  }

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  data?: T | Array<T>;

  @ApiProperty()
  message?: Array<string>;

  @ApiProperty()
  error?: string;
}
