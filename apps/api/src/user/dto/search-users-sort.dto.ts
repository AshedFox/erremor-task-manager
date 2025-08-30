import { User } from '@prisma/client';

import { createSortDtoFactory } from '@/common/sort';

export class SearchUsersSortDto extends createSortDtoFactory<User>()([
  'createdAt',
  'birthDate',
  'username',
  'displayName',
  'status',
]) {}
