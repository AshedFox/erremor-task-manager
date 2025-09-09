import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { OffsetPaginationDto } from '@/common/pagination';

import { InvitationsIncludeDto } from './dto/invitation-include.dto';
import { SearchProjectInvitationsFilterDto } from './dto/search-project-invitations-filter.dto';
import { SearchProjectInvitationsResponseDto } from './dto/search-project-invitations-response.dto';
import { SearchProjectInvitationsSortDto } from './dto/search-project-invitations-sort.dto';
import { ProjectInvitationService } from './project-invitation.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserInvitationController {
  constructor(private readonly invitationService: ProjectInvitationService) {}

  @Get('me/invitations')
  async searchMy(
    @CurrentUser('sub') userId: string,
    @Query() pagination: OffsetPaginationDto,
    @Query() filter: SearchProjectInvitationsFilterDto,
    @Query() sort: SearchProjectInvitationsSortDto,
    @Query() include: InvitationsIncludeDto
  ): Promise<SearchProjectInvitationsResponseDto> {
    const [nodes, totalCount] = await this.invitationService.searchByUser(
      userId,
      { skip: pagination.skip, take: pagination.take },
      filter,
      sort,
      include
    );

    return { nodes, totalCount };
  }
}
