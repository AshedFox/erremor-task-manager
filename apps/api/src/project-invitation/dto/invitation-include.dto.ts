import { Prisma } from '@prisma/client';

import { createIncludeDtoFactory } from '@/common/include';

export class InvitationsIncludeDto extends createIncludeDtoFactory<Prisma.ProjectInvitationInclude>()(
  ['inviter', 'project', 'user']
) {}
