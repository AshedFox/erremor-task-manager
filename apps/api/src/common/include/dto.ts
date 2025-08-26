import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

import { Include } from './types';

export function createIncludeDtoFactory<T>() {
  return function <const K extends readonly (keyof T)[]>(allowedFields: K) {
    type Field = K[number];

    class IncludeDtoClass {
      @Transform(({ value }) =>
        typeof value === 'string' ? value.split(',') : value
      )
      @IsOptional()
      @IsArray()
      @IsString({ each: true })
      @ArrayUnique()
      @IsIn(allowedFields, { each: true })
      include?: Field[];
    }

    return IncludeDtoClass as new () => Include<T, Field>;
  };
}
