import { Prisma } from '@prisma/client';

import { createIncludeDtoFactory } from '@/common/include';

export class UsersIncludeDto extends createIncludeDtoFactory<Prisma.UserInclude>()(
  ['tasks', 'projects']
) {}
