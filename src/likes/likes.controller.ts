import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common'
import { ILikes } from './interface/likes'
import { Services } from '../utils/constranst'
import { User } from '../users/utils/user.decorator'
import { CreateLikeDto } from './dto/CreateLike.dto'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikesController {
  constructor(@Inject(Services.LIKES) private readonly likesService: ILikes) {}
  @Post()
  async create(@User('sub') userId: number, @Body() body: CreateLikeDto) {
    return await this.likesService.create({ userId, reviewId: body.reviewId })
  }
  @Delete(':id')
  async delete(@User('sub') userId: number, @Param('id', ParseIntPipe) id: number) {
    return await this.likesService.delete({ id, userId })
  }
  @Get('q')
  async getManyByReview(@Query('review') reviewId?: string, @Query('user') userId?: string) {
    const parsedReviewId = reviewId ? parseInt(reviewId, 10) : undefined
    const parsedUserId = userId ? parseInt(userId, 10) : undefined
    const query = { reviewId: parsedReviewId, userId: parsedUserId }
    return await this.likesService.getMany(query)
  }
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.likesService.getOne({ id })
  }
}
