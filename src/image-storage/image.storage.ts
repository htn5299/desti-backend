export interface IImageStorageService {
  upload(file: Express.MulterS3.File): Promise<string>
  uploads(files: Express.MulterS3.File[]): Promise<string[]>
  delete(key: string): any
}
