import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { LocalStorageStrategy } from './strategies/local-storage.strategy';
import { S3StorageStrategy } from './strategies/s3-storage.strategy';

@Module({
  controllers: [UploadController],
  providers: [UploadService, LocalStorageStrategy, S3StorageStrategy],
  exports: [UploadService],
})
export class UploadModule {}
