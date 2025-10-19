import { S3Client } from '@aws-sdk/client-s3';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { StorageService } from './storage.service';
import { S3_CLIENT_TOKEN } from './storage.token';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3_CLIENT_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          endpoint: configService.getOrThrow<string>('STORAGE_ENDPOINT'),
          forcePathStyle: true,
          region: configService.getOrThrow<string>('STORAGE_REGION'),
          credentials: {
            accessKeyId: configService.getOrThrow<string>('STORAGE_ACCESS_KEY'),
            secretAccessKey:
              configService.getOrThrow<string>('STORAGE_SECRET_KEY'),
          },
        });
      },
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
