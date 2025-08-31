import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { TaskModule } from '@/task/task.module';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [PrismaModule, TaskModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
