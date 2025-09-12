import {
  BanIcon,
  CrownIcon,
  EyeIcon,
  LogOutIcon,
  MailPlusIcon,
  ShieldIcon,
  UserCheckIcon,
  UserIcon,
} from 'lucide-react';

import { ParticipantRole, ParticipantStatus } from '@/types/participant';

export const PARTICIPANT_ROLES = ['GUEST', 'USER', 'ADMIN', 'OWNER'] as const;

export const PARTICIPANT_STATUSES = [
  'INVITED',
  'JOINED',
  'LEFT',
  'BANNED',
] as const;

export const PARTICIPANT_ROLES_HIERARCHY: Record<ParticipantRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  USER: 1,
  GUEST: 0,
};

export const PARTICIPANT_ROLES_ICONS: Record<
  ParticipantRole,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  OWNER: CrownIcon,
  ADMIN: ShieldIcon,
  USER: UserIcon,
  GUEST: EyeIcon,
};

export const PARTICIPANT_STATUSES_ICONS: Record<
  ParticipantStatus,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  LEFT: LogOutIcon,
  BANNED: BanIcon,
  INVITED: MailPlusIcon,
  JOINED: UserCheckIcon,
};

export const PARTICIPANTS_PAGE_SIZE = 20;
