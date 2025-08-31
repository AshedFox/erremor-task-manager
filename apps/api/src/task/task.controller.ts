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
import { OffsetPaginationDto } from '@/common/pagination/dto';
import { ProjectRole } from '@/project/decorators/project-roles.decorator';
import { ProjectRolesGuard } from '@/project/guards/project-roles.guard';

import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTasksFilterDto } from './dto/search-tasks-filter.dto';
import { SearchTasksResponseDto } from './dto/search-tasks-response.dto';
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
    @Query() pagination: OffsetPaginationDto,
    @Query() filter: SearchTasksFilterDto,
    @Query() sort: SearchTasksSortDto,
    @Query() include: TaskIncludeDto
  ): Promise<SearchTasksResponseDto> {
    const [nodes, totalCount] = await this.taskService.search(
      { skip: pagination.skip, take: pagination.take },
      filter,
      sort,
      include
    );

    return { nodes, totalCount };
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
