import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import ms, { StringValue } from 'ms';

import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  private refreshCookieName: string;
  private refreshCookieLifetime: number;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    this.refreshCookieName = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_COOKIE_NAME'
    );
    this.refreshCookieLifetime = ms(
      this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_LIFETIME')
    );
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const { refreshToken, ...rest } = await this.authService.login(data);

    res.cookie(this.refreshCookieName, refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: this.refreshCookieLifetime,
    });

    return rest;
  }

  @Post('register')
  async register(@Body() data: RegisterDto): Promise<void> {
    return this.authService.register(data);
  }

  @Post('activate')
  @HttpCode(204)
  async activate(@Body('token') activationToken: string): Promise<void> {
    return this.authService.activateAccount(activationToken);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const refreshToken = req.cookies[this.refreshCookieName] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token!');
    }
    const { refreshToken: newRefreshToken, ...rest } =
      await this.authService.refreshTokens(refreshToken);

    res.cookie(this.refreshCookieName, newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: this.refreshCookieLifetime,
    });

    return rest;
  }
}
