import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectParticipantModule } from '@/project-participant/project-participant.module';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserTaskController } from './user-task.controller';

@Module({
  imports: [PrismaModule, ProjectParticipantModule],
  controllers: [TaskController, UserTaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
