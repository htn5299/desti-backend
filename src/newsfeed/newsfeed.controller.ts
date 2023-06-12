import { Controller, Get, Inject, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { INewsfeed } from './interface/newsfeed'
import { User } from '../users/utils/user.decorator'
import { IReviewsService } from '../reviews/interface/reviews'

@Controller(Routes.NEWSFEED)
@UseGuards(JwtAuthGuard)
export class NewsfeedController {
  constructor(
    @Inject(Services.NEWSFEED) private readonly newsfeedService: INewsfeed,
    @Inject(Services.REVIEWS) private reviewsService: IReviewsService
  ) {}

  @Get()
  async newsfeed(@User('sub') userId: number, @Query('page', ParseIntPipe) page: number) {
    return this.newsfeedService.newsfeed(userId, page)
  }

  @Get(':userId')
  async getReviewByUser(@Param('userId', ParseIntPipe) user: number) {
    return await this.reviewsService.getAll({ user })
  }
}
