import { Controller, Get, Inject, Query, Param, Post, UseGuards, Body, ParseIntPipe } from '@nestjs/common'
import { IReviewsService } from './interface/reviews'
import { Routes, Services } from '../utils/constranst'
import { ReviewQueryDto } from './dto/ReviewQuery.dto'
import { UserPlaceIndex } from '../utils/types'
import { CreateReviewDto } from './dto/CreateReview.dto'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { User } from '../users/utils/user.decorator'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Controller(Routes.REVIEWS)
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(
    @Inject(Services.REVIEWS) private readonly reviewsService: IReviewsService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get()
  async getReviewsByPlace(@Query() query: ReviewQueryDto) {
    return await this.reviewsService.getAll(query)
  }

  @Post('places/:id')
  async createReview(
    @User('sub') userId: number,
    @Param('id', ParseIntPipe) placeId: number,
    @Body() content: CreateReviewDto
  ) {
    const createReview: UserPlaceIndex = { userId, placeId }
    const review = await this.reviewsService.create(createReview, content)
    this.eventEmitter.emit('review.create', review)
    return review
  }

  @Get('feed')
  async newsFeed(@Query('page', ParseIntPipe) page: number) {
    //Todo: paginate newsfeed with reviews
    return await this.reviewsService.reviewNewfeed(page)
  }
}
