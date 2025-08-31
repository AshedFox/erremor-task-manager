import {
  ParticipantRole,
  ParticipantStatus,
  ProjectParticipant,
} from '@prisma/client';

export type UpdateProjectParticipantParams = {
  role?: ParticipantRole;
  status?: ParticipantStatus;
};
export type FindManyProjectsParticipant = [ProjectParticipant[], number];
