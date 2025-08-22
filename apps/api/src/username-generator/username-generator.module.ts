import { Module } from '@nestjs/common';

import { UsernameGeneratorService } from './username-generator.service';

@Module({
  providers: [UsernameGeneratorService],
  exports: [UsernameGeneratorService],
})
export class UsernameGeneratorModule {}
