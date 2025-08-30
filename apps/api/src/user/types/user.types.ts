import { User } from '@prisma/client';

export type SafeUser = Omit<User, 'passwordHash'>;

export type FindManyUsersResult = [User[], number];
