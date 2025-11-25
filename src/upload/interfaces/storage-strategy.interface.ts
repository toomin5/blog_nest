export interface UploadResult {
  url: string;
  key: string;
  size: number;
  mimetype: string;
}

export interface IStorageStrategy {
  upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadResult>;

  delete(key: string): Promise<void>;

  getUrl(key: string): string;
}
