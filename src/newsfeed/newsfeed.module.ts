import { Module } from '@nestjs/common'
import { NewsfeedController } from './newsfeed.controller'
import { NewsfeedService } from './newsfeed.service'
import { Services } from '../utils/constranst'
import { UsersModule } from '../users/users.module'
import { ReviewsModule } from '../reviews/reviews.module'
import { FriendsModule } from '../friends/friends.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Review } from '../utils/typeorm/entities/Review.entity'

@Module({
  imports: [UsersModule, ReviewsModule, FriendsModule, TypeOrmModule.forFeature([Review])],
  controllers: [NewsfeedController],
  providers: [
    {
      provide: Services.NEWSFEED,
      useClass: NewsfeedService
    }
  ],
  exports: [
    {
      provide: Services.NEWSFEED,
      useClass: NewsfeedService
    }
  ]
})
export class NewsfeedModule {}
