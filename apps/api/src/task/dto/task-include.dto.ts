import { Prisma } from '@prisma/client';

import { createIncludeDtoFactory } from '@/common/include';

export class TaskIncludeDto extends createIncludeDtoFactory<Prisma.TaskInclude>()(
  ['tags', 'checkList', 'creator', 'project']
) {}
