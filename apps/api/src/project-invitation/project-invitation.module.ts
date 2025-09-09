import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectParticipantModule } from '@/project-participant/project-participant.module';

import { ProjectInvitationController } from './project-invitation.controller';
import { ProjectInvitationService } from './project-invitation.service';
import { UserInvitationController } from './user-invitation.controller';

@Module({
  imports: [PrismaModule, ProjectParticipantModule, AuthModule],
  controllers: [ProjectInvitationController, UserInvitationController],
  providers: [ProjectInvitationService],
  exports: [ProjectInvitationService],
})
export class ProjectInvitationModule {}
