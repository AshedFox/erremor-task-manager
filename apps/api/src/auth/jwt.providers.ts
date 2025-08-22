import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  ACCESS_JWT,
  ACTIVATION_JWT,
  REFRESH_JWT,
  RESET_JWT,
} from './constants/jwt';

export const jwtProviders = [
  {
    provide: ACCESS_JWT,
    useFactory: (config: ConfigService) =>
      new JwtService({
        secret: config.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('ACCESS_TOKEN_LIFETIME'),
        },
      }),
    inject: [ConfigService],
  },
  {
    provide: REFRESH_JWT,
    useFactory: (config: ConfigService) =>
      new JwtService({
        secret: config.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('REFRESH_TOKEN_LIFETIME'),
        },
      }),
    inject: [ConfigService],
  },
  {
    provide: RESET_JWT,
    useFactory: (config: ConfigService) =>
      new JwtService({
        secret: config.getOrThrow<string>('RESET_PASSWORD_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('RESET_PASSWORD_TOKEN_LIFETIME'),
        },
      }),
    inject: [ConfigService],
  },
  {
    provide: ACTIVATION_JWT,
    useFactory: (config: ConfigService) =>
      new JwtService({
        secret: config.getOrThrow<string>('ACTIVATION_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('ACTIVATION_TOKEN_LIFETIME'),
        },
      }),
    inject: [ConfigService],
  },
];
