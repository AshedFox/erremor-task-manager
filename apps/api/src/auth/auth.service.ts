import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import ms, { StringValue } from 'ms';

import { EmailService } from '@/email/email.service';
import { UserService } from '@/user/user.service';

import {
  ACCESS_JWT,
  ACTIVATION_JWT,
  REFRESH_JWT,
  RESET_JWT,
} from './constants/jwt';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenLifetime: StringValue;
  private readonly resetPasswordTokenLifetime: StringValue;
  private readonly activationTokenLifetime: StringValue;

  constructor(
    @Inject(ACCESS_JWT) private readonly accessJwtService: JwtService,
    @Inject(REFRESH_JWT) private readonly refreshJwtService: JwtService,
    @Inject(RESET_JWT) private readonly resetJwtService: JwtService,
    @Inject(ACTIVATION_JWT) private readonly activationJwtService: JwtService,
    @InjectRedis()
    private readonly redisService: Redis,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService
  ) {
    this.accessTokenExpiresIn =
      ms(this.configService.getOrThrow<StringValue>('ACCESS_TOKEN_LIFETIME')) /
      1000;
    this.refreshTokenLifetime = this.configService.getOrThrow<StringValue>(
      'REFRESH_TOKEN_LIFETIME'
    );
    this.resetPasswordTokenLifetime =
      this.configService.getOrThrow<StringValue>(
        'RESET_PASSWORD_TOKEN_LIFETIME'
      );
    this.activationTokenLifetime = this.configService.getOrThrow<StringValue>(
      'ACTIVATION_TOKEN_LIFETIME'
    );
  }
}
