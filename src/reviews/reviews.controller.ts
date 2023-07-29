import { Controller, Get, Inject, Param, Post, UseGuards, Body, ParseIntPipe, Delete, Patch } from '@nestjs/common'
import { IReviewsService } from './interface/reviews'
import { Action, Routes, ServerEvents, Services } from '../utils/constranst'
import { UserPlaceIndex } from '../utils/types'
import { CreateReviewDto } from './dto/CreateReview.dto'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { User } from '../users/utils/user.decorator'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { IFriendsService } from '../friends/interface/friend'
import { INotification } from '../notification/interface/notification'

@Controller(Routes.REVIEWS)
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(
    @Inject(Services.REVIEWS) private readonly reviewsService: IReviewsService,
    @Inject(Services.FRIENDS) private readonly friendsService: IFriendsService,
    @Inject(Services.NOTIFICATION) private readonly notificationsService: INotification,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post('places/:id')
  async createReview(
    @User('sub') userId: number,
    @Param('id', ParseIntPipe) placeId: number,
    @Body() content: CreateReviewDto
  ) {
    const userPlaceIndex: UserPlaceIndex = { userId, placeId }
    const newReview = await this.reviewsService.createReview(userPlaceIndex, content)
    //nhan review moi khi user dang xem
    this.eventEmitter.emit(ServerEvents.REVIEW_CREATE, newReview)
    const newNotification = await this.notificationsService.createNotification({
      service: Services.REVIEWS,
      action: Action.POST,
      entity: newReview.id,
      content: `has reviewed a place. ${content.review.split(' ').slice(0, 10).join(' ') + '...'}`,
      actor: newReview.user.id
    })
    //gui thong bao cho ban be
    const friends = await this.friendsService.list(newReview.user.id)
    friends &&
      friends.map(async (friend) => {
        const newNotificationRecipient = await this.notificationsService.createNotificationRecipient({
          recipient: friend.id,
          notification: newNotification.id
        })
        this.eventEmitter.emit(ServerEvents.FRIEND_REVIEW, {
          notificationRecipientId: newNotificationRecipient.id,
          recipientId: friend.id
        })
      })
    return newReview
  }

  @Get(':id')
  async getReviewById(@Param('id', ParseIntPipe) reviewId: number) {
    return await this.reviewsService.getReviewById(reviewId)
  }

  @Get('users/:userId')
  async getReviewsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.reviewsService.getReviewsByUserId(userId)
  }

  @Get('places/:placeId/me')
  async getMyReviewsByUserPlaceIndex(@User('sub') userId: number, @Param('placeId', ParseIntPipe) placeId: number) {
    return await this.reviewsService.getMyReviewsByUserPlaceIndex({ userId, placeId })
  }

  @Patch('places/:placeId')
  async updateMyReviewsByPlaceIndex(
    @User('sub') userId: number,
    @Param('placeId', ParseIntPipe) placeId: number,
    @Body() content: CreateReviewDto
  ) {
    const userPlaceIndex: UserPlaceIndex = { userId, placeId }
    const updateReview = await this.reviewsService.updateMyReviewsByPlaceIndex(userPlaceIndex, content)
    this.eventEmitter.emit(ServerEvents.REVIEW_CREATE, updateReview)
    const newNotification = await this.notificationsService.createNotification({
      service: Services.REVIEWS,
      action: Action.POST,
      entity: updateReview.id,
      actor: updateReview.user.id
    })
    //gui thong bao cho ban be
    const friends = await this.friendsService.list(updateReview.user.id)
    friends &&
      friends.map(async (friend) => {
        const newNotificationRecipient = await this.notificationsService.createNotificationRecipient({
          recipient: friend.id,
          notification: newNotification.id
        })
        this.eventEmitter.emit(ServerEvents.FRIEND_REVIEW, {
          notificationRecipientId: newNotificationRecipient.id,
          recipientId: friend.id
        })
      })
    return updateReview
  }

  @Delete('places/:placeId/me')
  async deleteReview(@User('sub') userId: number, @Param('placeId', ParseIntPipe) placeId: number) {
    const userPlaceIndex: UserPlaceIndex = { userId, placeId }
    const deleteReview = await this.reviewsService.deleteMyReviewsByPlaceIndex(userPlaceIndex)
    this.eventEmitter.emit(ServerEvents.REVIEW_DELETE, deleteReview)
    await this.notificationsService.deleteNotification({ entity: deleteReview.id })
    return deleteReview
  }

  @Get('places/:placeId')
  async getReviewsByPlaceId(@Param('placeId', ParseIntPipe) placeId: number) {
    return await this.reviewsService.getReviewsByPlaceId(placeId)
  }
}
