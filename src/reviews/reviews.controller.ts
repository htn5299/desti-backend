import { Controller, Get, Inject, Query, Param, Post, UseGuards, Body, Patch, ParseIntPipe } from '@nestjs/common'
import { IReviewsService } from './interface/reviews'
import { Routes, Services } from '../utils/constranst'
import { ReviewQueryDto } from './dto/ReviewQuery.dto'
import { CreateReview } from '../utils/types'
import { CreateReviewDto } from './dto/CreateReview.dto'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { User } from '../users/utils/user.decorator'

@Controller(Routes.REVIEWS)
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(@Inject(Services.REVIEWS) private readonly reviewsService: IReviewsService) {}
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
    const createReview: CreateReview = { userId, placeId }
    return await this.reviewsService.create(createReview, content)
  }
  @Patch('places/:id')
  async editReview(@Param('id', ParseIntPipe) id: number) {
    //TODO: handle Edit Review
    return 'handle edit review'
  }
}
