import { AuthResponseDto } from '../dto/auth-response.dto';

export type AuthResult = AuthResponseDto & {
  refreshToken: string;
};

export type DefaultTokenPayload = {
  sub: string;
};

export type GenerateTokenResult = {
  jti: string;
  token: string;
};

export type RefreshTokenPayload = DefaultTokenPayload & {
  jti: string;
};

export type RefreshTokenData = {
  jti: string;
  userId: string;
};

export type RotateRefreshTokenResult = {
  token: string;
  jti: string;
  userId: string;
};
