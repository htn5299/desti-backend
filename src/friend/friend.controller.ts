import { Body, Controller, Delete, Get, HttpStatus, Inject, Patch, Post, UseGuards } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { User } from '../users/utils/user.decorator'
import { FriendDto } from './dto/Friend.dto'
import { IFriendService } from './interface/friend'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { UpdateFriendDto } from './dto/UpdateFriend.dto'
import { MyHttpException } from '../utils/myHttpException'
@Controller(Routes.FRIEND)
export class FriendController {
  constructor(@Inject(Services.FRIEND) private readonly friendService: IFriendService) {}

  @UseGuards(JwtAuthGuard)
  @Post('request')
  async requestFriend(@User('sub') userId: number, @Body() friendDto: FriendDto) {
    if (isNaN(userId)) {
      throw new MyHttpException('Unauthorized', HttpStatus.BAD_REQUEST)
    }
    return await this.friendService.requestFriend(userId, friendDto)
  }
  @UseGuards(JwtAuthGuard)
  @Patch('respone')
  async responseFriend(@User('sub') userId: number, @Body() updateFriendDto: UpdateFriendDto) {
    if (isNaN(userId)) {
      throw new MyHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    return await this.friendService.responseFriend(userId, updateFriendDto)
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async listFriend(@User('sub') userId: number) {
    return await this.friendService.listFriends(userId)
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteFriend(@User('sub') userId: number, @Body() friendDto: FriendDto) {
    await this.friendService.deleteFriend(userId, friendDto)
  }
}
