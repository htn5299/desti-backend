import { Module } from '@nestjs/common'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { Services } from '../utils/constranst'

@Module({
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
