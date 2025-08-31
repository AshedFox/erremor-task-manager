import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ParticipantRole, Prisma, ProjectParticipant } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { Include, mapInclude } from '@/common/include';
import { OffsetPagination } from '@/common/pagination';
import { Sort } from '@/common/sort';
import { PrismaService } from '@/prisma/prisma.service';

import { ROLE_HIERARCHY } from './constants/role';
import { SearchProjectParticipantsFilterDto } from './dto/search-project-participants-filter.dto';
import {
  FindManyProjectsParticipant,
  UpdateProjectParticipantParams,
} from './types/project-participant.types';

@Injectable()
export class ProjectParticipantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: string,
    userId: string,
    role: ParticipantRole,
    tx: Prisma.TransactionClient = this.prisma
  ): Promise<ProjectParticipant> {
    try {
      return tx.projectParticipant.create({
        data: { projectId, userId, role },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('User already participate in project');
      }
      throw e;
    }
  }

  searchByProject(
    projectId: string,
    pagination: OffsetPagination,
    filter: SearchProjectParticipantsFilterDto,
    sort: Sort<ProjectParticipant>,
    { include }: Include<Prisma.ProjectParticipantInclude>
  ): Promise<FindManyProjectsParticipant> {
    const prismaInclude = mapInclude(include);

    return this.prisma.$transaction([
      this.prisma.projectParticipant.findMany({
        ...pagination,
        orderBy: sort.sortBy ? { [sort.sortBy]: sort.sortOrder } : undefined,
        where: { ...filter, projectId },
        include: prismaInclude,
      }),
      this.prisma.projectParticipant.count({ where: { ...filter, projectId } }),
    ]);
  }

  findManyByUser(
    userId: string,
    { include }: Include<Prisma.ProjectParticipantInclude>
  ): Promise<ProjectParticipant[]> {
    const prismaInclude = mapInclude(include);
    return this.prisma.projectParticipant.findMany({
      where: { userId },
      include: prismaInclude,
    });
  }

  async findOne(
    projectId: string,
    userId: string
  ): Promise<ProjectParticipant> {
    const participant = await this.prisma.projectParticipant.findUnique({
      where: { projectId_userId: { userId, projectId } },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    return participant;
  }

  async update(
    projectId: string,
    userId: string,
    initiatorId: string,
    data: UpdateProjectParticipantParams
  ): Promise<ProjectParticipant> {
    const [initiator, participant] = await this.prisma.$transaction([
      this.prisma.projectParticipant.findUnique({
        where: { projectId_userId: { projectId, userId: initiatorId } },
      }),
      this.prisma.projectParticipant.findUnique({
        where: { projectId_userId: { projectId, userId } },
      }),
    ]);

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    if (
      !initiator ||
      ROLE_HIERARCHY[initiator.role] <= ROLE_HIERARCHY[participant.role] ||
      (data.role && ROLE_HIERARCHY[initiator.role] <= ROLE_HIERARCHY[data.role])
    ) {
      throw new ForbiddenException("You don't have enough access");
    }

    return this.prisma.projectParticipant.update({
      where: { projectId_userId: { projectId, userId } },
      data,
    });
  }

  async remove(
    projectId: string,
    userId: string,
    initiatorId: string
  ): Promise<ProjectParticipant> {
    const [initiator, participant] = await this.prisma.$transaction([
      this.prisma.projectParticipant.findUnique({
        where: { projectId_userId: { projectId, userId: initiatorId } },
      }),
      this.prisma.projectParticipant.findUnique({
        where: { projectId_userId: { projectId, userId } },
      }),
    ]);

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    if (
      !initiator ||
      ROLE_HIERARCHY[initiator.role] <= ROLE_HIERARCHY[participant.role]
    ) {
      throw new ForbiddenException("You don't have enough access");
    }

    return this.prisma.projectParticipant.delete({
      where: { projectId_userId: { projectId, userId } },
    });
  }

  async leave(projectId: string, userId: string): Promise<ProjectParticipant> {
    const participant = await this.findOne(userId, projectId);

    if (participant.role === ParticipantRole.OWNER) {
      throw new ForbiddenException('Owner cannot leave the group');
    }

    return this.prisma.projectParticipant.delete({
      where: { projectId_userId: { projectId, userId } },
    });
  }
}
