import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { StorageModule } from '@/storage/storage.module';

import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
