import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsInt, IsPositive } from 'class-validator';

import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends OmitType(PartialType(CreateTaskDto), [
  'projectId',
]) {
  @IsInt()
  @IsPositive()
  version?: number;
}
