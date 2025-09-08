import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Tag } from '@prisma/client';

import { OffsetPaginationDto } from '@/common/pagination';

import { CreateTagDto } from './dto/create-tag.dto';
import { SearchTagsFilterDto } from './dto/search-tags-filter.dto';
import { SearchTagsResponseDto } from './dto/search-tags-response.dto';
import { SearchTagsSortDto } from './dto/search-tags-sort.dto';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagService.create(createTagDto);
  }

  @Get()
  async search(
    @Query() pagination: OffsetPaginationDto,
    @Query() filter: SearchTagsFilterDto,
    @Query() sort: SearchTagsSortDto
  ): Promise<SearchTagsResponseDto> {
    const [nodes, totalCount] = await this.tagService.search(
      { skip: pagination.skip, take: pagination.take },
      filter,
      sort
    );

    return { nodes, totalCount };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tag> {
    return this.tagService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Tag> {
    return this.tagService.remove(id);
  }
}
