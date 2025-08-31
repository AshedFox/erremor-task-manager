import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { OffsetPaginationDto } from '@/common/pagination';
import { SearchTasksFilterDto } from '@/task/dto/search-tasks-filter.dto';
import { SearchTasksResponseDto } from '@/task/dto/search-tasks-response.dto';
import { SearchTasksSortDto } from '@/task/dto/search-tasks-sort.dto';
import { TaskIncludeDto } from '@/task/dto/task-include.dto';
import { TaskService } from '@/task/task.service';

import { SearchUsersFilterDto } from './dto/search-users-filter.dto';
import { SearchUsersResponseDto } from './dto/search-users-response.dto';
import { SearchUsersSortDto } from './dto/search-users-sort.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersIncludeDto } from './dto/users-include.dto';
import { SafeUser } from './types/user.types';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService
  ) {}

  @Get()
  async search(
    @Query() pagination: OffsetPaginationDto,
    @Query() filter: SearchUsersFilterDto,
    @Query() sort: SearchUsersSortDto,
    @Query() include: UsersIncludeDto
  ): Promise<SearchUsersResponseDto> {
    const [nodes, totalCount] = await this.userService.search(
      { skip: pagination.skip, take: pagination.take },
      filter,
      sort,
      include
    );

    return { nodes, totalCount };
  }

  @Get('me/tasks')
  async searchMyTasks(
    @CurrentUser('sub') creatorId: string,
    @Query() pagination: OffsetPaginationDto,
    @Query() filter: SearchTasksFilterDto,
    @Query() sort: SearchTasksSortDto,
    @Query() include: TaskIncludeDto
  ): Promise<SearchTasksResponseDto> {
    const [nodes, totalCount] = await this.taskService.search(
      { skip: pagination.skip, take: pagination.take },
      { ...filter, creatorId },
      sort,
      include
    );

    return { nodes, totalCount };
  }

  @Get('me')
  findMe(@CurrentUser('sub') userId: string): Promise<SafeUser> {
    return this.userService.findOneById(userId);
  }

  @Patch('me')
  updateMe(
    @CurrentUser('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<SafeUser> {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete('me')
  removeMe(@CurrentUser('sub') userId: string): Promise<SafeUser> {
    return this.userService.remove(userId);
  }

  @Get(':id')
  findOne(@Param(ParseUUIDPipe) id: string): Promise<SafeUser> {
    return this.userService.findOneById(id);
  }
}
