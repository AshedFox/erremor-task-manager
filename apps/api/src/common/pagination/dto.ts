import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { OffsetPagination } from './types';

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
