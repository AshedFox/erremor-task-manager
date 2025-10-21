import { UnionToIntersection } from './common';
import { File } from './file';

type AccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export type User = {
  id: string;
  email: string;
  status: AccountStatus;
  displayName?: string;
  username: string;
  avatarId?: string;
  createdAt: string;
  updatedAt: string;
  birthDate?: string;
};

export type UserIncludeMap = {
  avatar: { avatar?: File };
};

export type UserWithInclude<K extends keyof UserIncludeMap> = User &
  UnionToIntersection<UserIncludeMap[K]>;
