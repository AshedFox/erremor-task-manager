import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { randomBytes } from 'crypto';
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
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordService } from './password.service';
import {
  AuthResult,
  DefaultTokenPayload,
  GenerateTokenResult,
  RefreshTokenData,
  RefreshTokenPayload,
  RotateRefreshTokenResult,
} from './types/auth.types';

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

  async register({ email, password }: RegisterDto): Promise<void> {
    try {
      const existingUser =
        await this.userService.findOneByEmailWithPassword(email);

      if (existingUser.status !== 'PENDING') {
        throw new ConflictException('User with this email already exists!');
      }

      const passwordMatches = await this.passwordService.verify(
        existingUser.passwordHash,
        password
      );

      if (!passwordMatches) {
        throw new UnauthorizedException('Failed to register!');
      }

      return this.emailService.sendAccountActivationEmail(
        email,
        await this.generateActivationToken(existingUser.id),
        this.activationTokenLifetime
      );
    } catch (e) {
      if (e instanceof NotFoundException) {
        const user = await this.userService.create({ email, password });

        return this.emailService.sendAccountActivationEmail(
          email,
          await this.generateActivationToken(user.id),
          this.activationTokenLifetime
        );
      }

      throw e;
    }
  }

  async login({ email, password }: LoginDto): Promise<AuthResult> {
    try {
      const existingUser =
        await this.userService.findOneByEmailWithPassword(email);

      const passwordMatches = await this.passwordService.verify(
        existingUser.passwordHash,
        password
      );

      if (!passwordMatches || existingUser.status !== 'ACTIVE') {
        throw new UnauthorizedException('Failed to login');
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(existingUser.id),
        this.generateRefreshToken(existingUser.id),
      ]);

      return {
        tokenType: 'Bearer',
        expiresIn: this.accessTokenExpiresIn,
        accessToken,
        refreshToken: refreshToken.token,
        user: existingUser,
      };
    } catch {
      throw new UnauthorizedException('Failed to login');
    }
  }

  async activateAccount(token: string): Promise<void> {
    const userId = await this.validateActivationToken(token);
    await this.userService.activate(userId);
  }

  generateAccessToken(userId: string): Promise<string> {
    return this.accessJwtService.signAsync({ userId });
  }

  async generateRefreshToken(userId: string): Promise<GenerateTokenResult> {
    const jti = randomBytes(16).toString('hex');
    const token = await this.refreshJwtService.signAsync({ sub: userId, jti });

    await this.redisService.set(
      `refresh:${jti}`,
      userId,
      'PX',
      ms(this.refreshTokenLifetime)
    );
    await this.redisService.sadd(`user_refresh:${userId}`, jti);

    return { token, jti };
  }

  async validateRefreshToken(token: string): Promise<RefreshTokenData> {
    let payload: RefreshTokenPayload;
    try {
      payload = await this.refreshJwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid refresh token!');
    }
    const { jti, sub: userId } = payload;
    if (!jti || !userId) {
      throw new UnauthorizedException('Invalid refresh token!');
    }

    const stored = await this.redisService.getdel(`refresh:${jti}`);
    await this.redisService.srem(`user_refresh:${userId}`, jti);

    if (!stored || stored !== userId) {
      throw new UnauthorizedException('Invalid refresh token!');
    }
    return { userId, jti };
  }

  async rotateRefreshToken(
    oldToken: string
  ): Promise<RotateRefreshTokenResult> {
    const { userId } = await this.validateRefreshToken(oldToken);
    const { jti, token } = await this.generateRefreshToken(userId);
    return { userId, jti, token };
  }

  async revokeRefreshToken(jti: string, userId: string): Promise<void> {
    await this.redisService.del(`refresh:${jti}`);
    await this.redisService.srem(`user_refresh:${userId}`, jti);
  }

  async revokeRefreshTokensForUser(userId: string): Promise<void> {
    const jtis = await this.redisService.smembers(`user_refresh:${userId}`);
    if (jtis && jtis.length) {
      const pipeline = this.redisService.pipeline();
      for (const jti of jtis) {
        pipeline.del(`refresh:${jti}`);
      }
      pipeline.del(`user_refresh:${userId}`);
      await pipeline.exec();
    }
  }

  async refreshTokens(oldRefreshToken: string): Promise<AuthResult> {
    const { token: refreshToken, userId } =
      await this.rotateRefreshToken(oldRefreshToken);
    const accessToken = await this.generateAccessToken(userId);
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.accessTokenExpiresIn,
      refreshToken,
      user: await this.userService.findOneById(userId),
    };
  }

  async generateResetPasswordToken(userId: string): Promise<string> {
    const token = await this.resetJwtService.signAsync({ sub: userId });

    await this.redisService.set(
      `reset_password:${userId}`,
      token,
      'PX',
      ms(this.resetPasswordTokenLifetime)
    );

    return token;
  }

  async generateActivationToken(userId: string): Promise<string> {
    const token = await this.activationJwtService.signAsync({ sub: userId });

    await this.redisService.set(
      `activate:${userId}`,
      token,
      'PX',
      ms(this.activationTokenLifetime)
    );

    return token;
  }

  async validateActivationToken(token: string): Promise<string> {
    let payload: DefaultTokenPayload;
    try {
      payload = await this.activationJwtService.verifyAsync(token);
    } catch {
      throw new BadRequestException('Invalid activation token!');
    }

    const userId = payload.sub;
    const storedToken = await this.redisService.getdel(`activate:${userId}`);

    if (!storedToken || storedToken !== token) {
      throw new BadRequestException('Invalid activation token!');
    }

    return userId;
  }

  async validateResetToken(token: string): Promise<string> {
    let payload: DefaultTokenPayload;
    try {
      payload = await this.resetJwtService.verifyAsync(token);
    } catch {
      throw new BadRequestException('Invalid reset token!');
    }

    const userId = payload.sub;
    const storedToken = await this.redisService.getdel(
      `reset_password:${userId}`
    );

    if (!storedToken || storedToken !== token) {
      throw new BadRequestException('Invalid reset token!');
    }

    return userId;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);

    return this.emailService.sendPasswordResetEmail(
      email,
      await this.generateResetPasswordToken(user.id),
      this.resetPasswordTokenLifetime
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const userId = await this.validateResetToken(token);
    await this.userService.setPassword(userId, newPassword);
    await this.revokeRefreshTokensForUser(userId);
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    await this.userService.updatePassword(userId, oldPassword, newPassword);
    await this.revokeRefreshTokensForUser(userId);
  }
}
