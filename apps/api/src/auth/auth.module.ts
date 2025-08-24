import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { EmailModule } from '@/email/email.module';
import { UserModule } from '@/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { jwtProviders } from './jwt.providers';
import { PasswordService } from './password.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    EmailModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('ACCESS_TOKEN_LIFETIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthController,
    PasswordService,
    JwtAuthGuard,
    ...jwtProviders,
  ],
  controllers: [AuthController],
  exports: [PasswordService],
})
export class AuthModule {}
