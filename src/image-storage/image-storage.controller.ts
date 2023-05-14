import { Body, Controller, Delete, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageStorageService } from './image-storage.service'
import { Routes, Services } from '../utils/constranst'
import { IImageStorageService } from './image.storage'

@Controller(Routes.IMAGE_STORAGE)
export class ImageStorageController {
  constructor(@Inject(Services.IMAGE_STORAGE) private readonly imageStorageService: IImageStorageService) {}
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
