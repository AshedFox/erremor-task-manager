import { IsOptional, IsString, Length } from 'class-validator';

export class SearchUsersFilterDto {
  @IsOptional()
  @IsString()
  @Length(2, 128)
  search?: string;
}
