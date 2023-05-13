import { Body, Controller, Delete, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageStorageService } from './image-storage.service'

@Controller('image-storage')
export class ImageStorageController {
  constructor(private imageStorageService: ImageStorageService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.MulterS3.File) {
    return await this.imageStorageService.upload(file)
  }
  @Delete()
  async delete(@Body('key') key: string) {
    return await this.imageStorageService.delete(key)
  }
}
