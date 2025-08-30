import { Injectable, NotFoundException } from '@nestjs/common';
import { ParticipantRole, Prisma, Project } from '@prisma/client';

import { Include, mapInclude } from '@/common/include';
import { OffsetPagination } from '@/common/pagination';
import { Sort } from '@/common/sort';
import { PrismaService } from '@/prisma/prisma.service';

import {
  CreateProjectParams,
  FindManyProjectsFilter,
  FindManyProjectsResult,
  UpdateProjectParams,
} from './types/project.types';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProjectParams): Promise<Project> {
    const { creatorId, ...rest } = data;
    return this.prisma.project.create({
      data: {
        ...rest,
        participants: {
          create: {
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
      participants: { some: { userId } },
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
}
