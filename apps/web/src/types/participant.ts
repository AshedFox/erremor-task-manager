import { PARTICIPANT_ROLES } from '@/constants/participant';

export type Participant = {
  id: string;
  role: ParticipantRole;
  joinedAt: string;
  projectId: string;
  userId: string;
};

export type ParticipantRole = (typeof PARTICIPANT_ROLES)[number];
