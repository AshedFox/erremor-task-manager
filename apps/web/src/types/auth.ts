import { User } from './user';

export type AuthResult = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: User;
};

export type AuthState = Omit<AuthResult, 'tokenType'>;
