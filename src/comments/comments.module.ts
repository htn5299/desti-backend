import { forwardRef, Module } from '@nestjs/common'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { ReviewsModule } from '../reviews/reviews.module'
import { CommentEntity } from '../utils/typeorm'
import { NotificationModule } from '../notification/notification.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    forwardRef(() => UsersModule),
    forwardRef(() => ReviewsModule),
    NotificationModule
  ],
  controllers: [CommentsController],
  providers: [
    {
      provide: Services.COMMENTS,
      useClass: CommentsService
    }
  ],
  exports: [
    {
      provide: Services.COMMENTS,
      useClass: CommentsService
    }
  ]
})
export class CommentsModule {}
