import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { UserModule } from '@/user/user.module';

import { ProjectParticipantController } from './project-participant.controller';
import { ProjectParticipantService } from './project-participant.service';
import { ProjectParticipantCacheService } from './project-participant-cache.service';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [ProjectParticipantController],
  providers: [ProjectParticipantService, ProjectParticipantCacheService],
  exports: [ProjectParticipantService],
})
export class ProjectParticipantModule {}
