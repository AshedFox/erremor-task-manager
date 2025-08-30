import { ParticipantRole } from '@prisma/client';

export const ROLE_HIERARCHY = {
  [ParticipantRole.OWNER]: 4,
  [ParticipantRole.ADMIN]: 3,
  [ParticipantRole.USER]: 2,
  [ParticipantRole.GUEST]: 1,
};
