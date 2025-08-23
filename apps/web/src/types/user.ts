type AccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  status: AccountStatus;
  displayName?: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  birthDate?: string;
};
