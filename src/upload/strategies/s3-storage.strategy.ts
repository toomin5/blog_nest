import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import type {
  IStorageStrategy,
  UploadResult,
} from '../interfaces/storage-strategy.interface';

@Injectable()
export class S3StorageStrategy implements IStorageStrategy {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';
    this.region = this.configService.get<string>('AWS_REGION') || 'ap-northeast-2';

    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    this.s3Client = new S3Client({
      region: this.region,
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
    });
  }

  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadResult> {
    const ext = file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const key = `${folder}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // 공개 읽기 권한 (필요시 변경)
    });

    await this.s3Client.send(command);

    return {
      url: this.getUrl(key),
      key,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Failed to delete file from S3: ${key}`, error);
    }
  }

  getUrl(key: string): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
