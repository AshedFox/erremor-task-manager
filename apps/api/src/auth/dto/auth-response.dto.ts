import { SafeUser } from '@/user/types/user.types';

export class AuthResponseDto {
  accessToken!: string;
  tokenType!: 'Bearer';
  expiresIn!: number;
  user!: SafeUser;
}
