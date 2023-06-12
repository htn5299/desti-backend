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

  @Post('places/:id')
  async createReview(
    @User('sub') userId: number,
    @Param('id', ParseIntPipe) placeId: number,
    @Body() content: CreateReviewDto
  ) {
    const userPlaceIndex: UserPlaceIndex = { userId, placeId }
    const review = await this.reviewsService.create(userPlaceIndex, content)
    this.eventEmitter.emit('review.create', review)
    return review
  }
  @Get()
  async getMyReview(@User('sub') userId: number, @Query('place', ParseIntPipe) placeId: number){
    return await this.reviewsService.findReview({ userId, placeId })
  }
}
