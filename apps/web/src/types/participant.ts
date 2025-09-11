import {
  PARTICIPANT_ROLES,
  PARTICIPANT_STATUSES,
} from '@/constants/participant';

export type Participant = {
  id: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  joinedAt?: string;
  projectId: string;
  userId: string;
};

export type ParticipantStatus = (typeof PARTICIPANT_STATUSES)[number];

export type ParticipantRole = (typeof PARTICIPANT_ROLES)[number];
