import { TaskPriority, TaskStatus } from '@prisma/client';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class SearchTasksFilterDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @IsOptional()
  @IsString()
  @Length(2, 128)
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  tags?: string[];
}
