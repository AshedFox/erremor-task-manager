import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsernameGeneratorModule } from '@/username-generator/username-generator.module';

import { UserService } from './user.service';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    UsernameGeneratorModule,
  ],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
