import { UnionToIntersection } from './common';
import { ParticipantRole } from './participant';
import { Project } from './project';
import { User } from './user';

export type Invitation = {
  id: string;
  role: ParticipantRole;
  invitedAt: string;
  invitedBy: string;
  expiresAt: string;
  userId: string;
  projectId: string;
};

export type InvitationIncludeMap = {
  project: { project: Project[] };
  inviter: { inviter: User[] };
  user: { user: User[] };
};

export type InvitationWithInclude<K extends keyof InvitationIncludeMap> =
  Invitation & UnionToIntersection<InvitationIncludeMap[K]>;
