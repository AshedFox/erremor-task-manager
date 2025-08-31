import { TaskPriority, TaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

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
  @IsDateString()
  @IsOptional()
  deadline?: Date;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsOptional()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  tags?: string[];
}
