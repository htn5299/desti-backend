import { Module } from '@nestjs/common'
import { ImageStorageService } from './image-storage.service'
import { ImageStorageController } from './image-storage.controller'
import { Services } from '../utils/constranst'
@Module({
  controllers: [ImageStorageController],
  providers: [
    {
      provide: Services.IMAGE_STORAGE,
      useClass: ImageStorageService
    }
  ],
  exports: [
    {
      provide: Services.IMAGE_STORAGE,
      useClass: ImageStorageService
    }
  ]
})
export class ImageStorageModule {}
