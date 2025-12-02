import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParticipantRole, ProjectParticipant } from '@prisma/client';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { OffsetPaginationDto } from '@/common/pagination';
import { ProjectIdSource } from '@/project/decorators/project-id-source.decorator';
import { ProjectRole } from '@/project/decorators/project-roles.decorator';
import { ProjectRolesGuard } from '@/project/guards/project-roles.guard';
import { SearchUsersFilterDto } from '@/user/dto/search-users-filter.dto';
import { UsersIncludeDto } from '@/user/dto/users-include.dto';
import { SafeUser } from '@/user/types/user.types';
import { UserService } from '@/user/user.service';

import { ProjectParticipantIncludeDto } from './dto/project-participant-include.dto';
import { SearchProjectParticipantsFilterDto } from './dto/search-project-participants-filter.dto';
import { SearchProjectParticipantsResponseDto } from './dto/search-project-participants-response.dto';
import { SearchProjectParticipantsSortDto } from './dto/search-project-participants-sort.dto';
import { ProjectParticipantService } from './project-participant.service';

@UseGuards(JwtAuthGuard, ProjectRolesGuard)
@ProjectIdSource('params')
@Controller('projects/:projectId')
export class ProjectParticipantController {
  constructor(
    private readonly participantService: ProjectParticipantService,
    private readonly usersService: UserService
  ) {}

  @ProjectRole(ParticipantRole.GUEST)
  @Get('users/me')
  findMe(
    @Param('projectId') projectId: string,
    @CurrentUser('sub') userId: string
  ) {
    return this.participantService.findOne(projectId, userId);
  }

  @ProjectRole(ParticipantRole.GUEST)
  @Get('users/:userId')
  findOne(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string
  ) {
    return this.participantService.findOne(projectId, userId);
  }

  @ProjectRole(ParticipantRole.GUEST)
  @Get('users')
  async searchByProject(
    @Param('projectId') projectId: string,
    @Query() pagination: OffsetPaginationDto,
    @Query() filter: SearchProjectParticipantsFilterDto,
    @Query() sort: SearchProjectParticipantsSortDto,
    @Query() include: ProjectParticipantIncludeDto
  ): Promise<SearchProjectParticipantsResponseDto> {
    const [nodes, totalCount] = await this.participantService.searchByProject(
      projectId,
      { skip: pagination.skip, take: pagination.take },
      filter,
      sort,
      include
    );

    return { nodes, totalCount };
  }

  @ProjectRole(ParticipantRole.GUEST)
  @Get('candidates')
  async findCandidates(
    @Param('projectId') projectId: string,
    @Query() pagination: OffsetPaginationDto,
    @Query() filter: SearchUsersFilterDto,
    @Query() include: UsersIncludeDto
  ): Promise<SafeUser[]> {
    return this.usersService.findAvailableForProject(
      projectId,
      { skip: pagination.skip, take: pagination.take },
      filter,
      include
    );
  }

  @ProjectRole(ParticipantRole.ADMIN)
  @Patch('users/:userId')
  async update(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @CurrentUser('sub') currentUserId: string,
    @Body('role') role: ParticipantRole
  ): Promise<ProjectParticipant> {
    return this.participantService.update(projectId, userId, currentUserId, {
      role,
    });
  }

  @ProjectRole(ParticipantRole.ADMIN)
  @Patch('users/:userId/ban')
  async ban(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @CurrentUser('sub') currentUserId: string
  ): Promise<ProjectParticipant> {
    return this.participantService.update(projectId, userId, currentUserId, {
      status: 'BANNED',
    });
  }

  @ProjectRole(ParticipantRole.GUEST)
  @Delete('leave')
  async leave(
    @Param('projectId') projectId: string,
    @CurrentUser('sub') userId: string
  ): Promise<ProjectParticipant> {
    return this.participantService.leave(projectId, userId);
  }

  @ProjectRole(ParticipantRole.ADMIN)
  @Delete('users/:userId')
  async remove(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @CurrentUser('sub') currentUserId: string
  ): Promise<ProjectParticipant> {
    return this.participantService.remove(projectId, userId, currentUserId);
  }
}
