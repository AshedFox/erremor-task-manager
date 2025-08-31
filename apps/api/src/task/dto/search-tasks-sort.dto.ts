import { Task } from '@prisma/client';

import { createSortDtoFactory } from '@/common/sort';

export class SearchTasksSortDto extends createSortDtoFactory<Task>()([
  'title',
  'deadline',
  'priority',
  'status',
]) {}
