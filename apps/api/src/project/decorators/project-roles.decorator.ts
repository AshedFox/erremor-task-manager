import { SetMetadata } from '@nestjs/common';
import { ParticipantRole } from '@prisma/client';

export const PROJECT_ROLE_KEY = 'project_roles';

export const ProjectRole = (role: ParticipantRole) =>
  SetMetadata(PROJECT_ROLE_KEY, role);
