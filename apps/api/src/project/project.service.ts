import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ParticipantRole,
  ParticipantStatus,
  Prisma,
  Project,
} from '@prisma/client';

import { Include, mapInclude } from '@/common/include';
import { OffsetPagination } from '@/common/pagination';
import { Sort } from '@/common/sort';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectParticipantService } from '@/project-participant/project-participant.service';

import {
  CreateProjectParams,
  FindManyProjectsFilter,
  FindManyProjectsResult,
  UpdateProjectParams,
} from './types/project.types';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly participantService: ProjectParticipantService
  ) {}

  create(data: CreateProjectParams): Promise<Project> {
    const { creatorId, ...rest } = data;
    return this.prisma.project.create({
      data: {
        ...rest,
        participants: {
          create: {
            status: ParticipantStatus.JOINED,
            role: ParticipantRole.OWNER,
            userId: creatorId,
          },
        },
      },
    });
  }

  search(
    pagination: OffsetPagination,
    filter: FindManyProjectsFilter,
    sort: Sort<Project>,
    { include }: Include<Prisma.ProjectInclude>
  ): Promise<FindManyProjectsResult> {
    const prismaInclude = mapInclude(include);
    const { search, userId, ...restFilter } = filter;
    const where = {
      OR: search
        ? [
            { name: { contains: search, mode: 'insensitive' } },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
      participants: { some: { userId, status: ParticipantStatus.JOINED } },
      ...restFilter,
    } satisfies Prisma.ProjectWhereInput;

    return this.prisma.$transaction([
      this.prisma.project.findMany({
        ...pagination,
        where,
        orderBy: sort.sortBy ? { [sort.sortBy]: sort.sortOrder } : undefined,
        include: prismaInclude,
      }),
      this.prisma.project.count({ where }),
    ]);
  }

  async searchRecent(
    pagination: OffsetPagination,
    filter: FindManyProjectsFilter,
    { include }: Include<Prisma.ProjectInclude>
  ): Promise<FindManyProjectsResult> {
    const { userId, ...rest } = filter;

    const filters = [];

    if (rest.status) {
      filters.push(Prisma.sql`p.status = ${rest.status}::"ProjectStatus"`);
    }

    if (rest.color) {
      filters.push(Prisma.sql`p.color = ${rest.color}`);
    }

    if (rest.search) {
      filters.push(
        Prisma.sql`p.name ILIKE ${`%${rest.search}%`} OR p.description ILIKE ${`%${rest.search}%`}`
      );
    }

    const whereClause =
      filters.length > 0
        ? Prisma.sql`AND ${Prisma.join(filters, ' AND ')}`
        : Prisma.empty;

    const selectFields = [Prisma.sql`p.*`];

    if (include?.includes('tasks')) {
      selectFields.push(
        Prisma.sql`COALESCE(json_agg(DISTINCT t.*) FILTER (WHERE t.id IS NOT NULL), '[]') as tasks`
      );
    }

    if (include?.includes('participants')) {
      selectFields.push(
        Prisma.sql`COALESCE(json_agg(DISTINCT pp2.*) FILTER (WHERE pp2.id IS NOT NULL), '[]') as participants`
      );
    }

    const selectClause = Prisma.join(selectFields, ', ');

    const joins = [];

    if (include?.includes('tasks')) {
      joins.push(Prisma.sql`LEFT JOIN "Task" t ON t."projectId" = p.id`);
    }

    if (include?.includes('participants')) {
      joins.push(
        Prisma.sql`LEFT JOIN "ProjectParticipant" pp2 ON pp2."projectId" = p.id`
      );
    }

    const joinClause =
      joins.length > 0 ? Prisma.join(joins, ' ') : Prisma.empty;

    return [
      await this.prisma.$queryRaw<Project[]>`
        SELECT ${selectClause}
        FROM "Project" p
        INNER JOIN "ProjectParticipant" pp ON pp."projectId" = p.id
        ${joinClause}
        WHERE pp."userId" = ${userId}::uuid
          AND pp.status = ${ParticipantStatus.JOINED}::"ParticipantStatus"
          ${whereClause}
        GROUP BY p.id, pp."lastViewedAt"
        ORDER BY pp."lastViewedAt" DESC NULLS LAST
        OFFSET ${pagination.skip}
        LIMIT ${pagination.take}
      `,
      await this.prisma.$queryRaw<[{ count: number }]>`
        SELECT COUNT(DISTINCT p.id)::int as count
        FROM "Project" p
        INNER JOIN "ProjectParticipant" pp ON pp."projectId" = p.id
        WHERE pp."userId" = ${userId}::uuid
          AND pp.status = ${ParticipantStatus.JOINED}::"ParticipantStatus"
          ${whereClause}
      `.then((result) => Number(result[0].count)),
    ];
  }

  async findOne(
    id: string,
    { include }: Include<Prisma.ProjectInclude>
  ): Promise<Project> {
    const prismaInclude = mapInclude(include);
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: prismaInclude,
    });

    if (!project) {
      throw new NotFoundException('Project not found!');
    }

    return project;
  }

  update(id: string, data: UpdateProjectParams): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  remove(id: string): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }

  async view(projectId: string, userId: string): Promise<void> {
    await this.participantService.updateLastViewedAt(projectId, userId);
  }
}
