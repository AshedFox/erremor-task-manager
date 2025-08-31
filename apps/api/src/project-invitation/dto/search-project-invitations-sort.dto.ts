import { ProjectInvitation } from '@prisma/client';

import { createSortDtoFactory } from '@/common/sort';

export class SearchProjectInvitationsSortDto extends createSortDtoFactory<ProjectInvitation>()(
  ['role', 'expiresAt', 'invitedAt']
) {}
