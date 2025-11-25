import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import type {
  IStorageStrategy,
  UploadResult,
} from './interfaces/storage-strategy.interface';
import { LocalStorageStrategy } from './strategies/local-storage.strategy';
import { S3StorageStrategy } from './strategies/s3-storage.strategy';

export enum ImageFolder {
  PROFILES = 'profiles',
  THUMBNAILS = 'thumbnails',
  POSTS = 'posts',
}

@Injectable()
export class UploadService {
  private storageStrategy: IStorageStrategy;

  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  private readonly maxFileSize = 5 * 1024 * 1024;

  constructor(
    private configService: ConfigService,
    private localStorageStrategy: LocalStorageStrategy,
    private s3StorageStrategy: S3StorageStrategy,
  ) {
    // 환경변수에 따라 스토리지 전략 선택
    const storageType = this.configService.get<string>('STORAGE_TYPE', 'local');

    this.storageStrategy =
      storageType === 's3' ? this.s3StorageStrategy : this.localStorageStrategy;

    console.log(`Using storage strategy: ${storageType}`);
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: ImageFolder,
    resize?: { width: number; height?: number },
  ): Promise<UploadResult> {
    // 파일 유효성 검사
    this.validateFile(file);

    let processedBuffer = file.buffer;

    // 이미지 리사이징 (옵션)
    if (resize) {
      processedBuffer = await this.resizeImage(file.buffer, resize);
    }

    // 처리된 버퍼로 파일 객체 업데이트
    const processedFile: Express.Multer.File = {
      ...file,
      buffer: processedBuffer,
      size: processedBuffer.length,
    };

    // 선택된 스토리지 전략으로 업로드
    return await this.storageStrategy.upload(processedFile, folder);
  }

  async deleteImage(key: string): Promise<void> {
    return await this.storageStrategy.delete(key);
  }

  getImageUrl(key: string): string {
    return this.storageStrategy.getUrl(key);
  }

  // 파일 유효성 검사
  private validateFile(file: Express.Multer.File): void {
    // 파일 존재 여부
    if (!file) {
      throw new BadRequestException('파일이 없습니다.');
    }

    // MIME 타입 검사
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        '허용되지 않는 파일 형식입니다. (jpg, png, gif, webp만 가능)',
      );
    }

    // 파일 크기 검사
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `파일 크기가 너무 큽니다. (최대 ${this.maxFileSize / 1024 / 1024}MB)`,
      );
    }
  }

  // 이미지 리사이징
  private async resizeImage(
    buffer: Buffer,
    options: { width: number; height?: number },
  ): Promise<Buffer> {
    const sharpInstance = sharp(buffer);

    if (options.height) {
      sharpInstance.resize(options.width, options.height, {
        fit: 'cover',
      });
    } else {
      sharpInstance.resize(options.width, null, {
        withoutEnlargement: true,
      });
    }

    return await sharpInstance.jpeg({ quality: 85 }).toBuffer();
  }
}
