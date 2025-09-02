import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParticipantRole, Task } from '@prisma/client';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Paginated, PaginationDto } from '@/common/pagination/dto';
import { ProjectRole } from '@/project/decorators/project-roles.decorator';
import { ProjectRolesGuard } from '@/project/guards/project-roles.guard';

import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTasksFilterDto } from './dto/search-tasks-filter.dto';
import { SearchTasksSortDto } from './dto/search-tasks-sort.dto';
import { TaskIncludeDto } from './dto/task-include.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(ProjectRolesGuard)
  @ProjectRole(ParticipantRole.USER)
  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser('sub') creatorId: string
  ): Promise<Task> {
    return this.taskService.create({ ...createTaskDto, creatorId });
  }

  @Get()
  async search(
    @Query() pagination: PaginationDto,
    @Query() filter: SearchTasksFilterDto,
    @Query() sort: SearchTasksSortDto,
    @Query() include: TaskIncludeDto
  ): Promise<Paginated<Task>> {
    if (pagination.skip !== undefined) {
      const [items, totalCount] = await this.taskService.search(
        { skip: pagination.skip, take: pagination.take },
        filter,
        sort,
        include
      );

      return {
        data: items,
        meta: {
          limit: pagination.limit,
          totalCount,
          currentPage: pagination.page,
          totalPages: Math.ceil(totalCount / pagination.limit),
          hasNext: pagination.skip + pagination.take < totalCount,
          sort: sort.sortBy ? sort : undefined,
        },
      };
    } else {
      const [items, totalCount] = await this.taskService.search(
        { cursor: pagination.cursor, take: pagination.take + 1 },
        filter,
        sort,
        include
      );

      const hasNext = items.length > pagination.limit;
      const data = hasNext ? items.slice(0, -1) : items;
      const nextCursor = hasNext ? items.at(-1)?.id : undefined;

      return {
        data,
        meta: {
          hasNext,
          nextCursor,
          limit: pagination.limit,
          totalCount,
          sort: sort.sortBy ? sort : undefined,
        },
      };
    }
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() include: TaskIncludeDto
  ): Promise<Task> {
    return this.taskService.findOne(id, include);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.taskService.remove(id);
  }
}
