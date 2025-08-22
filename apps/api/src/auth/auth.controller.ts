import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';

import { AuthService } from './auth.service';
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

  @Post('register')
  async register(@Body() data: RegisterDto): Promise<void> {
    return this.authService.register(data);
  }

  @Post('activate')
  @HttpCode(204)
  async activate(@Body('token') activationToken: string): Promise<void> {
    return this.authService.activateAccount(activationToken);
  }
}
