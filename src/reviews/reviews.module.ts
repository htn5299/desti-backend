import { forwardRef, Module } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Review } from '../utils/typeorm/entities/Review.entity'
import { UsersModule } from '../users/users.module'
import { PlacesModule } from '../places/places.module'

@Module({
  imports: [TypeOrmModule.forFeature([Review]), forwardRef(() => PlacesModule), forwardRef(() => UsersModule)],
  providers: [
    {
      provide: Services.REVIEWS,
      useClass: ReviewsService
    }
  ],
  exports: [
    {
      provide: Services.REVIEWS,
      useClass: ReviewsService
    }
  ]
})
export class ReviewsModule {}
