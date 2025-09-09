import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ParticipantStatus, Prisma, ProjectInvitation } from '@prisma/client';
import { randomBytes } from 'crypto';

import { PasswordService } from '@/auth/password.service';
import { Include, mapInclude } from '@/common/include';
import { OffsetPagination } from '@/common/pagination';
import { Sort } from '@/common/sort';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectParticipantService } from '@/project-participant/project-participant.service';

import { SearchProjectInvitationsFilterDto } from './dto/search-project-invitations-filter.dto';
import {
  CreateProjectInvitationParams,
  FindManyProjectInvitations,
  UpdateProjectInvitationParams,
} from './types/project-invitation.types';

@Injectable()
export class ProjectInvitationService {
  constructor(
    private readonly participantService: ProjectParticipantService,
    private readonly passwordService: PasswordService,
    private readonly prisma: PrismaService
  ) {}

  async create(
    projectId: string,
    userId: string,
    data: CreateProjectInvitationParams
  ): Promise<ProjectInvitation> {
    const token = randomBytes(32).toString('hex');
    const tokenHash = await this.passwordService.hash(token);

    return this.prisma.$transaction(async (tx) => {
      await this.participantService.create(projectId, userId, data.role, tx);

      return tx.projectInvitation.create({
        data: {
          ...data,
          tokenHash,
          userId,
          projectId,
        },
      });
    });
  }

  async accept(
    projectId: string,
    userId: string,
    token: string
  ): Promise<ProjectInvitation> {
    return this.prisma.$transaction(async (tx) => {
      const invitation = await tx.projectInvitation.findUnique({
        where: { projectId_userId: { projectId, userId } },
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (invitation.expiresAt > new Date()) {
        throw new BadRequestException('Invite expired');
      }

      if (!(await this.passwordService.verify(invitation.tokenHash, token))) {
        throw new BadRequestException('Invalid invite');
      }

      await tx.projectParticipant.update({
        where: { projectId_userId: { projectId, userId } },
        data: { joinedAt: new Date() },
      });

      return tx.projectInvitation.delete({
        where: { projectId_userId: { projectId, userId } },
      });
    });
  }

  searchByProject(
    projectId: string,
    pagination: OffsetPagination,
    filter: SearchProjectInvitationsFilterDto,
    sort: Sort<ProjectInvitation>,
    { include }: Include<Prisma.ProjectInvitationInclude>
  ): Promise<FindManyProjectInvitations> {
    const prismaInclude = mapInclude(include);

    return this.prisma.$transaction([
      this.prisma.projectInvitation.findMany({
        ...pagination,
        where: { projectId, ...filter },
        orderBy: sort.sortBy ? { [sort.sortBy]: sort.sortOrder } : undefined,
        include: prismaInclude,
      }),
      this.prisma.projectInvitation.count({ where: { projectId, ...filter } }),
    ]);
  }

  searchByUser(
    userId: string,
    pagination: OffsetPagination,
    filter: SearchProjectInvitationsFilterDto,
    sort: Sort<ProjectInvitation>,
    { include }: Include<Prisma.ProjectInvitationInclude>
  ): Promise<FindManyProjectInvitations> {
    const prismaInclude = mapInclude(include);

    return this.prisma.$transaction([
      this.prisma.projectInvitation.findMany({
        ...pagination,
        where: { userId, ...filter },
        orderBy: sort.sortBy ? { [sort.sortBy]: sort.sortOrder } : undefined,
        include: prismaInclude,
      }),
      this.prisma.projectInvitation.count({ where: { userId, ...filter } }),
    ]);
  }

  findOne(
    projectId: string,
    userId: string,
    { include }: Include<Prisma.ProjectInvitationInclude>
  ) {
    const prismaInclude = mapInclude(include);

    return this.prisma.projectInvitation.findUnique({
      where: { projectId_userId: { projectId, userId } },
      include: prismaInclude,
    });
  }

  update(
    projectId: string,
    userId: string,
    data: UpdateProjectInvitationParams
  ) {
    return this.prisma.projectInvitation.update({
      where: { projectId_userId: { projectId, userId } },
      data,
    });
  }

  remove(projectId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.projectParticipant.delete({
        where: {
          projectId_userId: { projectId, userId },
          status: ParticipantStatus.INVITED,
        },
      });
      return tx.projectInvitation.delete({
        where: { projectId_userId: { projectId, userId } },
      });
    });
  }
}
