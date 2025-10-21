import {
  Body,
  Controller,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { File } from '@prisma/client';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

import { InitUploadDto } from './dto/init-upload.dto';
import { InitUploadResponseDto } from './dto/init-upload-response.dto';
import { FileService } from './file.service';

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('init')
  initUpload(@Body() data: InitUploadDto): Promise<InitUploadResponseDto> {
    return this.fileService.initUpload(data);
  }

  @Post(':id/complete')
  completeUpload(@Param('id') id: string): Promise<File> {
    return this.fileService.completeUpload(id);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearOldNotUploadedFiles() {
    Logger.log('Clearing old not uploaded files from db...');
    const deletedCount = await this.fileService.clearOldNotUploadedFiles();
    Logger.log(`Deleted ${deletedCount} old not uploaded files from db`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearUnused() {
    Logger.log('Clearing unused files...');
    const deletedCount = await this.fileService.clearUnused();
    Logger.log(`Deleted ${deletedCount} unused files`);
  }
}
