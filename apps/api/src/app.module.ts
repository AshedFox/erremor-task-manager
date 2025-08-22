import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
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
    AuthModule,
    UsernameGeneratorModule,
    EmailModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
