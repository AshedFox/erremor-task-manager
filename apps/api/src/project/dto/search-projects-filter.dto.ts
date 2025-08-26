import { ProjectStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class SearchProjectsFilterDto {
  @IsOptional()
  @IsString()
  @Length(2, 128)
  search?: string;

  @IsOptional()
  @IsString()
  @Length(3, 32)
  color?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
