import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { User } from '../users/utils/user.decorator'
import { IFriendsService } from './interface/friend'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { UpdateFriendDto } from './dto/UpdateFriend.dto'
import { MyHttpException } from '../utils/myHttpException'
import { FriendParamDto } from './dto/FriendParam.dto'
@Controller(Routes.FRIENDS)
export class FriendsController {
  constructor(@Inject(Services.FRIENDS) private readonly friendsService: IFriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async request(@User('sub') userId: number, @Param() friend: FriendParamDto) {
    const { id: friendId } = friend
    if (isNaN(userId)) {
      throw new MyHttpException('Unauthorized', HttpStatus.BAD_REQUEST)
    }
    return await this.friendsService.request(userId, friendId)
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async response(
    @User('sub') userId: number,
    @Param() friend: FriendParamDto,
    @Body() updateFriendDto: UpdateFriendDto
  ) {
    const { id: friendId } = friend
    if (isNaN(userId)) {
      throw new MyHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    return await this.friendsService.response(userId, friendId, updateFriendDto)
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async listFriend(@User('sub') userId: number) {
    return await this.friendsService.list(userId)
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@User('sub') userId: number, @Param() friend: FriendParamDto) {
    const { id: friendId } = friend
    if (isNaN(friendId)) {
      throw new MyHttpException('Friend Id must be a number', HttpStatus.UNAUTHORIZED)
    }
    await this.friendsService.delete(userId, friendId)
  }
}
