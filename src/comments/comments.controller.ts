import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { User } from '../users/utils/user.decorator'
import { IComments } from './interface/comments'
import { CreateCommentDto } from './dto/CreateComment.dto'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
@UseGuards(JwtAuthGuard)
@Controller(Routes.COMMENTS)
export class CommentsController {
  constructor(@Inject(Services.COMMENTS) private readonly commentService: IComments) {}
  @Post()
  async create(@User('sub') userId: number, @Body() body: CreateCommentDto) {
    return await this.commentService.create({ userId, ...body })
  }
  @Delete(':id')
  async delete(@User('sub') userId: number, @Param('id', ParseIntPipe) id: number) {
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
