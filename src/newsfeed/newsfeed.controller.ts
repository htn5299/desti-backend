import { Controller, Get, Inject, ParseIntPipe, Query, UseGuards } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { User } from '../users/utils/user.decorator'
import { IReviewsService } from '../reviews/interface/reviews'

@Controller(Routes.NEWSFEED)
@UseGuards(JwtAuthGuard)
export class NewsfeedController {
  constructor(@Inject(Services.REVIEWS) private reviewsService: IReviewsService) {}

  @Get()
  async newsfeed(@User('sub') userId: number, @Query('page', ParseIntPipe) page: number) {
    return this.reviewsService.newsfeed(userId, page)
  }
}
