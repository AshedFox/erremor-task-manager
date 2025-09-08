import { Injectable, NotFoundException } from '@nestjs/common';
import { Tag } from '@prisma/client';

import { OffsetPagination } from '@/common/pagination';
import { Sort } from '@/common/sort';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateTagDto } from './dto/create-tag.dto';
import { SearchTagsFilterDto } from './dto/search-tags-filter.dto';
import { FindManyTagsResult } from './types/tag.types';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTagDto): Promise<Tag> {
    return this.prisma.tag.create({
      data,
    });
  }

  search(
    pagination: OffsetPagination,
    filter: SearchTagsFilterDto,
    sort: Sort<Tag>
  ): Promise<FindManyTagsResult> {
    return this.prisma.$transaction([
      this.prisma.tag.findMany({
        ...pagination,
        where: { name: { contains: filter.name, mode: 'insensitive' } },
        orderBy: sort.sortBy ? { [sort.sortBy]: sort.sortOrder } : undefined,
      }),
      this.prisma.tag.count({
        where: { name: { contains: filter.name, mode: 'insensitive' } },
      }),
    ]);
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  remove(id: string): Promise<Tag> {
    return this.prisma.tag.delete({ where: { id } });
  }
}
