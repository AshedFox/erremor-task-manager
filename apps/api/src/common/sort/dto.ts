import { IsIn, IsOptional } from 'class-validator';

import { IsSortOrderString } from '../validation/decorators';
import { Sort } from './types';

export function createSortDtoFactory<T>() {
  return function <const K extends readonly (keyof T)[]>(allowedFields: K) {
    type Field = K[number];

    class SortDtoClass {
      @IsOptional()
      @IsIn(allowedFields)
      sortBy?: Field;

      @IsOptional()
      @IsSortOrderString()
      sortOrder?: 'asc' | 'desc' = 'asc';
    }

    return SortDtoClass as new () => Sort<T, Field>;
  };
}
