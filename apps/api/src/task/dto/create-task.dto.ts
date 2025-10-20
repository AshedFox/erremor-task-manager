import { TaskPriority, TaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';

import { CreateTagDto } from '@/tag/dto/create-tag.dto';

export class CreateTaskDto {
  @IsString()
  @IsUUID()
  projectId!: string;

  @IsString()
  @Length(2, 100)
  title!: string;

  @IsString()
  @Length(3, 4000)
  @IsOptional()
  description?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  deadline?: Date;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsOptional()
  @ArrayUnique()
  @IsUUID(4, { each: true })
  existingTags?: string[];

  @Type(() => CreateTagDto)
  @IsOptional()
  @ArrayUnique((tag: CreateTagDto) => tag.name.toLowerCase())
  @ValidateNested({ each: true })
  newTags?: CreateTagDto[];

  @IsOptional()
  @ArrayUnique()
  @IsUUID(4, { each: true })
  filesIds?: string[];
}
