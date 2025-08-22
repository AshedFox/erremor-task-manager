import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly appName: string;
  private readonly appUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {
    this.appName = this.configService.getOrThrow<string>('APP_NAME');
    this.appUrl = this.configService.getOrThrow<string>('APP_FRONTEND_URL');
  }
}
