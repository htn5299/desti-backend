import { forwardRef, Module } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Review } from '../utils/typeorm'
import { UsersModule } from '../users/users.module'
import { PlacesModule } from '../places/places.module'
import { ReviewsController } from './reviews.controller'
import { FriendsModule } from '../friends/friends.module'
import { NotificationModule } from '../notification/notification.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    FriendsModule,
    NotificationModule,
    forwardRef(() => PlacesModule),
    forwardRef(() => UsersModule)
  ],
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
  ],
  controllers: [ReviewsController]
})
export class ReviewsModule {}
