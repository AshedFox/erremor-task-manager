import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { EmailModule } from '@/email/email.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { ProjectInvitationController } from './project-invitation.controller';
import { ProjectInvitationService } from './project-invitation.service';
import { UserInvitationController } from './user-invitation.controller';

@Module({
  imports: [PrismaModule, AuthModule, EmailModule],
  controllers: [ProjectInvitationController, UserInvitationController],
  providers: [ProjectInvitationService],
  exports: [ProjectInvitationService],
})
export class ProjectInvitationModule {}
