import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type {
  IStorageStrategy,
  UploadResult,
} from '../interfaces/storage-strategy.interface';

@Injectable()
export class LocalStorageStrategy implements IStorageStrategy {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.baseUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:3000';

    // uploads 폴더 생성
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadResult> {
    // 폴더 생성
    const folderPath = path.join(this.uploadDir, folder);
    await fs.mkdir(folderPath, { recursive: true });

    // 파일명 생성 (UUID + 확장자)
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(folderPath, filename);

    // 파일 저장
    await fs.writeFile(filePath, file.buffer);

    const key = `${folder}/${filename}`;

    return {
      url: this.getUrl(key),
      key,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file: ${key}`, error);
    }
  }

  getUrl(key: string): string {
    return `${this.baseUrl}/uploads/${key}`;
  }
}
