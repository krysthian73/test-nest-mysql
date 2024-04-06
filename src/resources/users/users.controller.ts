import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFullDto } from './dto/user-full.dto';
import { AuthOwnerAdminGuard } from '../auth-owner-admin.guard';
import { ResultType } from '../types';

@ApiTags('users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthOwnerAdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Users found successfully',
    status: HttpStatus.OK,
    type: ResultType<UserFullDto[]>,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
    type: ResultType,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResultType<UserFullDto[]>> {
    const users = await this.usersService.findAll();
    const usersFullDto: UserFullDto[] = users.map(
      (user) => new UserFullDto(user),
    );
    return new ResultType<UserFullDto[]>(HttpStatus.OK, [], '', usersFullDto);
  }

  @Get(':id')
  @UseGuards(AuthOwnerAdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'User found successfully',
    status: HttpStatus.OK,
    type: ResultType<UserFullDto>,
  })
  @ApiResponse({
    description: 'User not found',
    status: HttpStatus.NOT_FOUND,
    type: ResultType,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
    type: ResultType,
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ResultType<UserFullDto>> {
    const user = await this.usersService.findOne({ id: +id });
    if (!user) {
      return new ResultType(HttpStatus.NOT_FOUND, [], 'User not found');
    }
    return new ResultType(HttpStatus.OK, [], '', new UserFullDto(user));
  }

  @Patch(':id')
  @UseGuards(AuthOwnerAdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'User updated successfully',
    status: HttpStatus.OK,
    type: ResultType<UserFullDto[]>,
  })
  @ApiResponse({
    description: 'Bad request',
    status: HttpStatus.BAD_REQUEST,
    type: ResultType,
  })
  @ApiResponse({
    description: 'User not found',
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
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResultType<UserFullDto>> {
    const user = await this.usersService.update(+id, updateUserDto);
    if (!user) {
      return new ResultType(HttpStatus.NOT_FOUND, [], 'User not found');
    }
    return new ResultType(HttpStatus.OK, [], '', new UserFullDto(user));
  }

  @Delete(':id')
  @UseGuards(AuthOwnerAdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'User deleted successfully',
    status: HttpStatus.OK,
    type: ResultType,
  })
  @ApiResponse({
    description: 'User not found',
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
    await this.usersService.remove(+id);
    return new ResultType(HttpStatus.OK, [], 'User deleted successfully');
  }
}
