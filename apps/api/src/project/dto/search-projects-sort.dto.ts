import { Project } from '@prisma/client';

import { createSortDtoFactory } from '@/common/sort';

export class SearchProjectsSortDto extends createSortDtoFactory<Project>()([
  'name',
  'createdAt',
  'updatedAt',
  'status',
]) {}
