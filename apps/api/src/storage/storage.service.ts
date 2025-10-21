import {
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { Readable } from 'stream';

import { S3_CLIENT_TOKEN } from './storage.token';

@Injectable()
export class StorageService implements OnModuleInit {
  private bucket: string;
  private endpoint: string;

  constructor(
    @Inject(S3_CLIENT_TOKEN) private readonly s3: S3Client,
    configService: ConfigService
  ) {
    this.bucket = configService.getOrThrow<string>('STORAGE_BUCKET');
    this.endpoint = configService.getOrThrow<string>('STORAGE_ENDPOINT');
  }
  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.s3.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  getUploadUrl(
    key: string,
    mimetype: string,
    expiresIn: number = 600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimetype,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  getPublicUrl(key: string) {
    return new URL(`${this.bucket}/${key}`, this.endpoint).href;
  }

  async upload(
    key: string,
    mimetype: string,
    data: string | Uint8Array | Buffer | Readable
  ) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: data,
      ContentType: mimetype,
    });

    await this.s3.send(command);

    return { url: this.getPublicUrl(key) };
  }

  async getSize(key: string): Promise<number> {
    const command = new HeadObjectCommand({ Bucket: this.bucket, Key: key });

    const { ContentLength } = await this.s3.send(command);

    if (ContentLength === undefined) {
      throw new Error('Cannot get file size');
    }

    return ContentLength;
  }

  async delete(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }

    const command = new DeleteObjectsCommand({
      Bucket: this.bucket,
      Delete: { Objects: keys.map((key) => ({ Key: key })), Quiet: true },
    });

    command.middlewareStack.add(
      (next) => async (args) => {
        const request = args.request as {
          body?: string;
          headers: Record<string, string>;
        };
        if (typeof request.body === 'string') {
          const hash = createHash('md5')
            .update(request.body, 'utf8')
            .digest('base64');
          request.headers['Content-MD5'] = hash;
        }
        return next(args);
      },
      {
        step: 'build',
        name: 'addContentMD5Middleware',
      }
    );

    await this.s3.send(command);
  }
}
