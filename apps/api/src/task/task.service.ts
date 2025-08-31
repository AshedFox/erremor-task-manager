import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';

import { Include, mapInclude } from '@/common/include';
import { OffsetPagination } from '@/common/pagination';
import { Sort } from '@/common/sort';
import { PrismaService } from '@/prisma/prisma.service';

import { SearchTasksFilterDto } from './dto/search-tasks-filter.dto';
import { TaskIncludeDto } from './dto/task-include.dto';
import {
  CreateTaskParams,
  FindManyTasksResult,
  UpdateTaskParams,
} from './types/task.types';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskParams): Promise<Task> {
    const { tags, ...rest } = data;
    return this.prisma.task.create({
      data: {
        ...rest,
        tags: tags
          ? {
              connect: tags.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
    });
  }

  async search(
    pagination: OffsetPagination,
    filter: SearchTasksFilterDto,
    sort: Sort<Task>,
    { include }: Include<Prisma.TaskInclude>
  ): Promise<FindManyTasksResult> {
    const prismaInclude = mapInclude(include);
    const { search, tags, ...restFilter } = filter;
    const where = {
      OR: search
        ? [
            { title: { contains: search, mode: 'insensitive' } },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
      tags: tags ? { some: { id: { in: tags } } } : undefined,
      ...restFilter,
    } satisfies Prisma.TaskWhereInput;

    return this.prisma.$transaction([
      this.prisma.task.findMany({
        ...pagination,
        where: where,
        orderBy: sort.sortBy ? { [sort.sortBy]: sort.sortOrder } : undefined,
        include: prismaInclude,
      }),
      this.prisma.task.count({ where }),
    ]);
  }

  async findOne(id: string, { include }: TaskIncludeDto): Promise<Task> {
    const prismaInclude = mapInclude(include);
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: prismaInclude,
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }

    return task;
  }

  update(id: string, data: UpdateTaskParams): Promise<Task> {
    const { tags, ...rest } = data;

    return this.prisma.task.update({
      where: { id },
      data: {
        ...rest,
        tags: tags
          ? {
              connect: tags.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
    });
  }

  remove(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
