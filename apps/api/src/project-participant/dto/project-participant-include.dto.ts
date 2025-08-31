import { Prisma } from '@prisma/client';

import { createIncludeDtoFactory } from '@/common/include';

export class ProjectParticipantIncludeDto extends createIncludeDtoFactory<Prisma.ProjectParticipantInclude>()(
  ['project', 'user']
) {}
