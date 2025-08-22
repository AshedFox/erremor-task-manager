import { forwardRef, Module } from '@nestjs/common';

import { EmailModule } from '@/email/email.module';
import { UserModule } from '@/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtProviders } from './jwt.providers';
import { PasswordService } from './password.service';

@Module({
  imports: [forwardRef(() => UserModule), EmailModule],
  providers: [AuthService, AuthController, PasswordService, ...jwtProviders],
  controllers: [AuthController],
  exports: [PasswordService],
})
export class AuthModule {}
