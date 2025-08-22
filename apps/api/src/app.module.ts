import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsernameGeneratorModule } from './username-generator/username-generator.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsernameGeneratorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
