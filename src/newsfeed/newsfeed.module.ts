import { Module } from '@nestjs/common'
import { NewsfeedController } from './newsfeed.controller'
import { UsersModule } from '../users/users.module'
import { ReviewsModule } from '../reviews/reviews.module'

@Module({
  imports: [UsersModule, ReviewsModule],
  controllers: [NewsfeedController]
})
export class NewsfeedModule {}
