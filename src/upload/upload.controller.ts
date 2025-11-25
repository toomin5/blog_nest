import {
  Controller,
  Post,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService, ImageFolder } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 프로필 이미지 업로드
  @Post('profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.uploadService.uploadImage(file, ImageFolder.PROFILES, {
      width: 300,
      height: 300,
    });
  }

  // 게시글 썸네일 업로드
  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('file'))
  async uploadThumbnail(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.uploadService.uploadImage(file, ImageFolder.THUMBNAILS, {
      width: 800,
    });
  }

  // 게시글 본문 이미지 업로드
  @Post('post-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPostImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.uploadService.uploadImage(file, ImageFolder.POSTS, {
      width: 1200,
    });
  }

  // 이미지 삭제
  @Delete(':key(*)')
  async deleteImage(@Param('key') key: string) {
    await this.uploadService.deleteImage(key);
    return { message: '이미지가 삭제되었습니다.' };
  }
}
