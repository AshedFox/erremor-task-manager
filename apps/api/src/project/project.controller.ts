import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParticipantRole, Project } from '@prisma/client';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { OffsetPaginationDto } from '@/common/pagination/dto';

import { ProjectRole } from './decorators/project-roles.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsIncludeDto } from './dto/projects-include.dto';
import { SearchProjectsFilterDto } from './dto/search-projects-filter.dto';
import { SearchProjectsResponseDto } from './dto/search-projects-response.dto';
import { SearchProjectsSortDto } from './dto/search-projects-sort.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRolesGuard } from './guards/project-roles.guard';
import { ProjectService } from './project.service';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser('sub') creatorId: string
  ): Promise<Project> {
    return this.projectService.create({ ...createProjectDto, creatorId });
  }

  @Get()
  async search(
    @CurrentUser('sub') userId: string,
    @Query() pagination: OffsetPaginationDto,
    @Query() filter: SearchProjectsFilterDto,
    @Query() sort: SearchProjectsSortDto,
    @Query() include: ProjectsIncludeDto
  ): Promise<SearchProjectsResponseDto> {
    const [projects, count] = await this.projectService.search(
      { skip: pagination.skip, take: pagination.take },
      { ...filter, userId },
      sort,
      include
    );

    return { nodes: projects, totalCount: count };
  }

  @UseGuards(ProjectRolesGuard)
  @ProjectRole(ParticipantRole.GUEST)
  @Get(':projectId')
  findOne(
    @Param('projectId') id: string,
    @Query() include: ProjectsIncludeDto
  ): Promise<Project> {
    return this.projectService.findOne(id, include);
  }

  @UseGuards(ProjectRolesGuard)
  @ProjectRole(ParticipantRole.OWNER)
  @Patch(':projectId')
  update(
    @Param('projectId') id: string,
    @Body() updateProjectDto: UpdateProjectDto
  ): Promise<Project> {
    return this.projectService.update(id, updateProjectDto);
  }

  @UseGuards(ProjectRolesGuard)
  @ProjectRole(ParticipantRole.OWNER)
  @Delete(':projectId')
  remove(@Param('projectId') id: string): Promise<Project> {
    return this.projectService.remove(id);
  }
}
