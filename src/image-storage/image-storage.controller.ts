import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { Routes, Services } from '../utils/constranst'
import { IImageStorageService } from './image.storage'

@Controller(Routes.IMAGE_STORAGE)
export class ImageStorageController {
  constructor(@Inject(Services.IMAGE_STORAGE) private readonly imageStorageService: IImageStorageService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/
        })
        .addMaxSizeValidator({ maxSize: 5242880 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    )
    file: Express.MulterS3.File
  ) {
    return await this.imageStorageService.upload(file)
  }
  @Post('abc')
  @UseInterceptors(FilesInterceptor('files'))
  async uploads(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/
        })
        .addMaxSizeValidator({ maxSize: 5242880 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    )
    files: Express.MulterS3.File[]
  ) {
    return await this.imageStorageService.uploads(files)
  }
  @Delete()
  async delete(@Body('key') key: string) {
    return await this.imageStorageService.delete(key)
  }
}
