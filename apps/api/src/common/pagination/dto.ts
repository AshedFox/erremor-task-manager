import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

import { Sort } from '../sort';
import { CursorPagination, OffsetPagination } from './types';

export class OffsetPaginationDto implements OffsetPagination {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit: number = 20;

  get skip(): number {
    return this.page * this.limit;
  }

  get take(): number {
    return this.limit;
  }
}

export class CursorPaginationDto implements CursorPagination {
  @IsString()
  cursor!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit: number = 20;

  get take(): number {
    return this.limit;
  }
}

export class PaginationDto {
  @ValidateIf((o) => (o as PaginationDto).skip === undefined)
  @IsOptional()
  @IsString()
  cursor?: string;

  @ValidateIf((o) => (o as PaginationDto).cursor === undefined)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit: number = 20;

  get skip(): number {
    return this.page * this.limit;
  }

  get take(): number {
    return this.limit;
  }
}

export class Paginated<T> {
  data!: T[];
  meta!: PaginationMeta<T>;
}

export class PaginationMeta<T> {
  totalCount?: number;
  limit!: number;
  currentPage?: number;
  totalPages?: number;
  hasNext!: boolean;
  nextCursor?: string;
  sort?: Sort<T>;
}
