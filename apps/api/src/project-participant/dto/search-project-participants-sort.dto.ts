import { ProjectParticipant } from '@prisma/client';

import { createSortDtoFactory } from '@/common/sort';

export class SearchProjectParticipantsSortDto extends createSortDtoFactory<ProjectParticipant>()(
  ['joinedAt', 'role', 'status']
) {}
