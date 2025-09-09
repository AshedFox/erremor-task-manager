import { Controller, Get, Query } from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { OffsetPaginationDto } from '@/common/pagination';

import { SearchTasksFilterDto } from './dto/search-tasks-filter.dto';
import { SearchTasksResponseDto } from './dto/search-tasks-response.dto';
import { SearchTasksSortDto } from './dto/search-tasks-sort.dto';
import { TaskIncludeDto } from './dto/task-include.dto';
import { TaskService } from './task.service';

@Controller('users')
export class UserTaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('me/tasks')
  async searchMy(
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
}
