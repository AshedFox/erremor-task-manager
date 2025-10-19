import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from '@nestjs-modules/ioredis';

import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { FileModule } from './file/file.module';
import { ProjectModule } from './project/project.module';
import { ProjectInvitationModule } from './project-invitation/project-invitation.module';
import { ProjectParticipantModule } from './project-participant/project-participant.module';
import { StorageModule } from './storage/storage.module';
import { TagModule } from './tag/tag.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { UsernameGeneratorModule } from './username-generator/username-generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.getOrThrow<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.getOrThrow<string>('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsernameGeneratorModule,
    EmailModule,
    UserModule,
    FileModule,
    TaskModule,
    ProjectModule,
    ProjectParticipantModule,
    ProjectInvitationModule,
    TagModule,
    StorageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
