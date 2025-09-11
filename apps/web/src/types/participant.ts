import {
  PARTICIPANT_ROLES,
  PARTICIPANT_STATUSES,
} from '@/constants/participant';

import { UnionToIntersection } from './common';
import { Project } from './project';
import { User } from './user';

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

export type ParticipantIncludeMap = {
  project: { project: Project[] };
  user: { user: User[] };
};

export type ParticipantWithInclude<K extends keyof ParticipantIncludeMap> =
  Participant & UnionToIntersection<ParticipantIncludeMap[K]>;
