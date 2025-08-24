import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import ms, { StringValue } from 'ms';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
      path: '/',
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

    try {
      const { refreshToken: newRefreshToken, ...rest } =
        await this.authService.refreshTokens(refreshToken);

      res.cookie(this.refreshCookieName, newRefreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: this.refreshCookieLifetime,
      });

      return rest;
    } catch (e) {
      res.cookie(this.refreshCookieName, '', {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
      throw e;
    }
  }

  @Post('request-password-reset')
  @HttpCode(204)
  async requestPasswordReset(@Body('email') email: string): Promise<void> {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @HttpCode(204)
  async resetPassword(
    @Body('token') resetToken: string,
    @Body('newPassword') newPassword: string
  ): Promise<void> {
    return this.authService.resetPassword(resetToken, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(204)
  async changePassword(
    @CurrentUser('sub') userId: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string
  ): Promise<void> {
    return this.authService.changePassword(userId, oldPassword, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const refreshToken = req.cookies[this.refreshCookieName] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token!');
    }
    await this.authService.logout(refreshToken);
    res.cookie(this.refreshCookieName, '', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
  }
}
