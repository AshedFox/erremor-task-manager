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
}
