import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async sendAccountActivationEmail(
    email: string,
    token: string,
    lifetime: string
  ) {
    try {
      const activationLink = `${this.appUrl}/auth/activate?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Approve registration',
        template: 'activation',
        context: {
          activationLink,
          appName: this.appName,
          currentYear: new Date().getFullYear(),
          lifetime,
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to send email!');
    }
  }

  async sendPasswordResetEmail(email: string, token: string, lifetime: string) {
    try {
      const resetLink = `${this.appUrl}/auth/reset-password?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Approve registration',
        template: 'reset-password',
        context: {
          resetLink,
          appName: this.appName,
          currentYear: new Date().getFullYear(),
          lifetime,
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to send email!');
    }
  }

  async sendProjectInviteEmail(
    email: string,
    token: string,
    projectName: string,
    expiresAt: Date
  ) {
    try {
      const invitationLink = `${this.appUrl}/invitations/accept?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Accept invitation to project',
        template: 'project-invitation',
        context: {
          invitationLink,
          appName: this.appName,
          currentYear: new Date().getFullYear(),
          expiresAt,
          projectName,
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to send email!');
    }
  }
}
