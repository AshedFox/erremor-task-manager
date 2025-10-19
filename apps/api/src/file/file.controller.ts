import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
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
}
