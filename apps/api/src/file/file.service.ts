import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { File, FileStatus, FileType } from '@prisma/client';
import { randomUUID } from 'crypto';

import { PrismaService } from '@/prisma/prisma.service';
import { StorageService } from '@/storage/storage.service';

import { InitUploadDto } from './dto/init-upload.dto';

@Injectable()
export class FileService {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService
  ) {}

  private makeKey(id: string, type: FileType) {
    return `${type}/${id}`;
  }

  async initUpload(data: InitUploadDto) {
    const id = randomUUID();
    const key = this.makeKey(id, data.type);
    const uploadUrl = await this.storageService.getUploadUrl(
      key,
      data.mimetype
    );
    const url = this.storageService.getPublicUrl(key);

    await this.prisma.file.create({
      data: {
        ...data,
        id,
        url,
      },
    });

    return { fileId: id, uploadUrl };
  }

  async completeUpload(id: string): Promise<File> {
    const existing = await this.prisma.file.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('File not found!');
    }

    if (existing.status === FileStatus.UPLOADED) {
      throw new BadRequestException('File already uploaded!');
    }

    const key = this.makeKey(id, existing.type);
    const realSize = await this.storageService.getSize(key);

    const file = await this.prisma.file.update({
      where: { id },
      data: { size: realSize, status: FileStatus.UPLOADED },
    });

    return file;
  }

  async remove(id: string): Promise<File> {
    const file = await this.prisma.file.findUnique({ where: { id } });

    if (!file) {
      throw new NotFoundException('File not found!');
    }

    await this.storageService.delete(this.makeKey(id, file.type));

    return this.prisma.file.delete({ where: { id } });
  }

  async clearOldNotUploadedFiles(): Promise<number> {
    const { count } = await this.prisma.file.deleteMany({
      where: {
        status: FileStatus.PENDING,
        createdAt: { lt: new Date(Date.now() - 3_600_000) },
      },
    });

    return count;
  }

  async clearUnused(): Promise<number> {
    const filesToDelete = await this.prisma.file.findMany({
      where: {
        status: FileStatus.UPLOADED,
        createdAt: { lt: new Date(Date.now() - 3_600_000) },
        tasks: {
          none: {},
        },
      },
    });

    if (filesToDelete.length === 0) {
      return 0;
    }

    await this.storageService.deleteMany(
      filesToDelete.map((file) => this.makeKey(file.id, file.type))
    );

    await this.prisma.file.deleteMany({
      where: { id: { in: filesToDelete.map((file) => file.id) } },
    });

    return filesToDelete.length;
  }
}
