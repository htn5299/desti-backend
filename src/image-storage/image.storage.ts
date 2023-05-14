export interface IImageStorageService {
  upload(file: Express.MulterS3.File): any
  delete(key: string): any
}
