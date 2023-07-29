import { Module } from '@nestjs/common'
import { PlacesController } from './places.controller'
import { PlacesService } from './places.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { ReviewsModule } from '../reviews/reviews.module'
import { Place } from '../utils/typeorm'
import { PlaceImagesModule } from '../place-images/place-images.module'

@Module({
  imports: [TypeOrmModule.forFeature([Place]), UsersModule, ReviewsModule, PlaceImagesModule],
  controllers: [PlacesController],
  providers: [
    {
      provide: Services.PLACES,
      useClass: PlacesService
    }
  ],
  exports: [
    {
      provide: Services.PLACES,
      useClass: PlacesService
    }
  ]
})
export class PlacesModule {}
