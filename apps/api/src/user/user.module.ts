import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { TaskModule } from '@/task/task.module';
import { UsernameGeneratorModule } from '@/username-generator/username-generator.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    UsernameGeneratorModule,
    TaskModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
