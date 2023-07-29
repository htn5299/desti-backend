import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common'
import { Action, Routes, ServerEvents, Services } from '../utils/constranst'
import { User } from '../users/utils/user.decorator'
import { IComments } from './interface/comments'
import { CreateCommentDto } from './dto/CreateComment.dto'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { INotification } from '../notification/interface/notification'
import { IReviewsService } from '../reviews/interface/reviews'

@UseGuards(JwtAuthGuard)
@Controller(Routes.COMMENTS)
export class CommentsController {
  constructor(
    @Inject(Services.COMMENTS) private readonly commentService: IComments,
    private readonly eventEmitter: EventEmitter2,
    @Inject(Services.NOTIFICATION) private readonly notificationsService: INotification,
    @Inject(Services.REVIEWS) private readonly reviewsService: IReviewsService
  ) {}

  @Post()
  async create(@User('sub') userId: number, @Body() body: CreateCommentDto) {
    const newComment = await this.commentService.create({ userId, ...body })
    const newNotification = await this.notificationsService.createNotification({
      service: Services.COMMENTS,
      action: Action.POST,
      entity: newComment.id,
      content: `has commented on 1 review.: ${newComment.comment.split(' ').slice(0, 10).join(' ')}`,
      actor: newComment.user.id
    })
    const review = await this.reviewsService.getReviewById(body.reviewId)
    if (userId !== review.user.id) {
      const newNotificationRecipient = await this.notificationsService.createNotificationRecipient({
        recipient: review.user.id,
        notification: newNotification.id
      })
      this.eventEmitter.emit(ServerEvents.COMMENT_CREATE, {
        notificationRecipientId: newNotificationRecipient.id,
        recipientId: review.user.id
      })
    }
    return newComment
  }

  @Delete(':id')
  async delete(@User('sub') userId: number, @Param('id', ParseIntPipe) id: number) {
    await this.notificationsService.deleteNotification({ entity: id })
    return await this.commentService.delete({ id, userId })
  }

  @Get('q')
  async getManyByReview(@Query('review') reviewId?: string, @Query('user') userId?: string) {
    const parsedReviewId = reviewId ? parseInt(reviewId, 10) : undefined
    const parsedUserId = userId ? parseInt(userId, 10) : undefined
    const query = { reviewId: parsedReviewId, userId: parsedUserId }
    return await this.commentService.getMany(query)
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.commentService.getOne({ id })
  }
}
