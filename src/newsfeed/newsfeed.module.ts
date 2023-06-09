import { Module } from '@nestjs/common'
import { NewsfeedController } from './newsfeed.controller'
import { NewsfeedService } from './newsfeed.service'
import { Services } from '../utils/constranst'

@Module({
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
