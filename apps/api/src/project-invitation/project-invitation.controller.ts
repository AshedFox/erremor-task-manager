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
import { ParticipantRole, ProjectInvitation } from '@prisma/client';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { OffsetPaginationDto } from '@/common/pagination';
import { ProjectRole } from '@/project/decorators/project-roles.decorator';
import { ProjectRolesGuard } from '@/project/guards/project-roles.guard';

import { CreateProjectInvitationDto } from './dto/create-project-invitation.dto';
import { InvitationsIncludeDto } from './dto/invitation-include.dto';
import { SearchProjectInvitationsFilterDto } from './dto/search-project-invitations-filter.dto';
import { SearchProjectInvitationsResponseDto } from './dto/search-project-invitations-response.dto';
import { SearchProjectInvitationsSortDto } from './dto/search-project-invitations-sort.dto';
import { UpdateProjectInvitationDto } from './dto/update-project-invitation.dto';
import { ProjectInvitationService } from './project-invitation.service';

@Controller('projects/:projectId/invite')
export class ProjectInvitationController {
  constructor(private readonly invitationService: ProjectInvitationService) {}

  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  @ProjectRole(ParticipantRole.ADMIN)
  @Post(':userId')
  async create(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @CurrentUser('sub') currentUserId: string,
    @Body() data: CreateProjectInvitationDto
  ): Promise<ProjectInvitation> {
    return this.invitationService.create(projectId, userId, {
      ...data,
      invitedBy: currentUserId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':token/accept')
  async accept(
    @CurrentUser('sub') currentUserId: string,
    @Param('projectId') projectId: string,
    @Param('token') token: string
  ): Promise<ProjectInvitation> {
    return this.invitationService.accept(projectId, currentUserId, token);
  }

  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  @ProjectRole(ParticipantRole.ADMIN)
  @Get()
  async search(
    @Param('projectId') projectId: string,
    @Query() pagination: OffsetPaginationDto,
    @Query() filter: SearchProjectInvitationsFilterDto,
    @Query() sort: SearchProjectInvitationsSortDto,
    @Query() include: InvitationsIncludeDto
  ): Promise<SearchProjectInvitationsResponseDto> {
    const [nodes, totalCount] = await this.invitationService.searchByProject(
      projectId,
      { skip: pagination.skip, take: pagination.take },
      filter,
      sort,
      include
    );

    return { nodes, totalCount };
  }

  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  @ProjectRole(ParticipantRole.ADMIN)
  @Get(':userId')
  findOne(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Query() include: InvitationsIncludeDto
  ) {
    return this.invitationService.findOne(projectId, userId, include);
  }

  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  @ProjectRole(ParticipantRole.ADMIN)
  @Patch(':userId')
  update(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body() data: UpdateProjectInvitationDto
  ) {
    return this.invitationService.update(projectId, userId, data);
  }

  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  @ProjectRole(ParticipantRole.ADMIN)
  @Delete(':userId')
  remove(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string
  ) {
    return this.invitationService.remove(projectId, userId);
  }
}
