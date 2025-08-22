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
