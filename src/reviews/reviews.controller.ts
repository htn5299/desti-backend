import { Controller, Get, Inject, Param, Post, UseGuards, Body, ParseIntPipe, Delete, Patch } from '@nestjs/common'
import { IReviewsService } from './interface/reviews'
import { Routes, Services } from '../utils/constranst'
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
    const review = await this.reviewsService.createReview(userPlaceIndex, content)
    this.eventEmitter.emit('review.create', review)
    return review
  }

  @Get('places/:placeId')
  async getReviewsByPlaceId(@Param('placeId', ParseIntPipe) placeId: number) {
    return await this.reviewsService.getReviewsByPlaceId(placeId)
  }

  @Get('users/:userId')
  async getReviewsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.reviewsService.getReviewsByUserId(userId)
  }
  @Get('places/:placeId/me')
  async getMyReviewsByUserPlaceIndex(@User('sub') userId: number, @Param('placeId', ParseIntPipe) placeId: number) {
    return await this.reviewsService.getMyReviewsByUserPlaceIndex({ userId, placeId })
  }

  @Patch('places/:placeId/me')
  async updateMyReviewsByPlaceIndex(
    @User('sub') userId: number,
    @Param('placeId', ParseIntPipe) placeId: number,
    @Body() content: CreateReviewDto
  ) {
    const userPlaceIndex: UserPlaceIndex = { userId, placeId }
    return await this.reviewsService.updateMyReviewsByPlaceIndex(userPlaceIndex, content)
  }
  @Delete('places/:placeId/me')
  async deleteReview(@User('sub') userId: number, @Param('placeId', ParseIntPipe) placeId: number) {
    const userPlaceIndex: UserPlaceIndex = { userId, placeId }
    const deleteReview = await this.reviewsService.deleteMyReviewsByPlaceIndex(userPlaceIndex)
    this.eventEmitter.emit('review.delete', deleteReview)
    return deleteReview
  }
}
