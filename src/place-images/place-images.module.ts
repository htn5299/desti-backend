import { forwardRef, Module } from '@nestjs/common'
import { PlaceImagesService } from './place-images.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlaceImage } from '../utils/typeorm'
import { ImageStorageModule } from '../image-storage/image-storage.module'
import { PlacesModule } from '../places/places.module'

@Module({
  imports: [TypeOrmModule.forFeature([PlaceImage]), ImageStorageModule, forwardRef(() => PlacesModule)],
  providers: [
    {
      provide: Services.PLACE_IMAGES,
      useClass: PlaceImagesService
    }
  ],
  exports: [
    {
      provide: Services.PLACE_IMAGES,
      useClass: PlaceImagesService
    }
  ]
})
export class PlaceImagesModule {}
