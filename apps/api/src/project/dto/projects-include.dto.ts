import { Prisma } from '@prisma/client';

import { createIncludeDtoFactory } from '@/common/include';

export class ProjectsIncludeDto extends createIncludeDtoFactory<Prisma.ProjectInclude>()(
  ['tasks', 'creator', 'participants']
) {}
