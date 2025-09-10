import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { EmailService } from './email.service';
import { EmailJobData, EmailJobName } from './types/email.types';

@Processor('email')
export class EmailConsumer extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job) {
    switch (job.name as EmailJobName) {
      case 'sendActivation': {
        const { email, token, lifetime } =
          job.data as EmailJobData['sendActivation'];
        await this.emailService.sendAccountActivationEmail(
          email,
          token,
          lifetime
        );
        break;
      }
      case 'sendPasswordReset': {
        const { email, token, lifetime } =
          job.data as EmailJobData['sendPasswordReset'];
        await this.emailService.sendPasswordResetEmail(email, token, lifetime);
        break;
      }
      case 'sendProjectInvitation': {
        const { email, token, projectName, expiresAt } =
          job.data as EmailJobData['sendProjectInvitation'];
        await this.emailService.sendProjectInviteEmail(
          email,
          token,
          projectName,
          expiresAt
        );
        break;
      }
    }
  }
}
