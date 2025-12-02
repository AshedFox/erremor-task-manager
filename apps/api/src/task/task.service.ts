import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';

import { Include, mapInclude } from '@/common/include';
import { Pagination } from '@/common/pagination';
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
    const { existingTags, newTags, filesIds, ...rest } = data;

    return this.prisma.task.create({
      data: {
        ...rest,
        tags: {
          connect: existingTags
            ? existingTags.map((id) => ({ id }))
            : undefined,
          create: newTags ? newTags : undefined,
        },
        files: {
          connect: filesIds ? filesIds.map((id) => ({ id })) : undefined,
        },
      },
    });
  }

  async search(
    pagination: Pagination,
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

    const orderBy = {
      ...(sort.sortBy ? { [sort.sortBy]: sort.sortOrder } : undefined),
      ...(pagination.cursor ? { id: 'asc' } : undefined),
    } satisfies Prisma.TaskOrderByWithAggregationInput;

    return this.prisma.$transaction([
      this.prisma.task.findMany({
        take: pagination.take,
        cursor: pagination.cursor ? { id: pagination.cursor } : undefined,
        skip: pagination.skip !== undefined ? pagination.skip : undefined,
        where: where,
        orderBy,
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
    const { existingTags, newTags, filesIds, version, ...rest } = data;

    return this.prisma.$transaction(async (tx) => {
      const currentTask = await tx.task.findUnique({
        where: { id },
      });

      if (!currentTask) {
        throw new NotFoundException(`Task with id ${id} not found!`);
      }

      if (currentTask.version !== version) {
        const actualTask = await tx.task.findUnique({
          where: { id },
          include: { tags: true, files: true },
        });

        throw new ConflictException({
          message: 'Task has been updated by another user',
          data: actualTask,
        });
      }

      return tx.task.update({
        where: { id },
        data: {
          ...rest,
          version: { increment: 1 },
          tags: {
            set: existingTags ? existingTags.map((id) => ({ id })) : undefined,
            create: newTags ? newTags : undefined,
          },
          files: { set: filesIds?.map((id) => ({ id })) },
        },
      });
    });
  }

  remove(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
