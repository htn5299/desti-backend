import { Module } from '@nestjs/common'
import { ImageStorageService } from './image-storage.service'
import { ImageStorageController } from './image-storage.controller'
@Module({
  controllers: [ImageStorageController],
  providers: [ImageStorageService]
})
export class ImageStorageModule {}
