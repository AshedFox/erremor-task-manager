import { IsOptional, IsString, Length } from 'class-validator';

export class SearchTagsFilterDto {
  @IsOptional()
  @IsString()
  @Length(2, 64)
  name?: string;
}
