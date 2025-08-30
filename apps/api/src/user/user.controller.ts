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

import { SearchUsersFilterDto } from './dto/search-users-filter.dto';
import { SearchUsersSortDto } from './dto/search-users-sort.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersIncludeDto } from './dto/users-include.dto';
import { SafeUser } from './types/user.types';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  search(
    @Query() pagination: OffsetPaginationDto,
    @Query() filter: SearchUsersFilterDto,
    @Query() sort: SearchUsersSortDto,
    @Query() include: UsersIncludeDto
  ) {
    return this.userService.search(
      { skip: pagination.skip, take: pagination.take },
      filter,
      sort,
      include
    );
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
    console.log('try to find me :)');
    return this.userService.findOneById(id);
  }
}
