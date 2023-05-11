import { Body, Controller, Delete, Get, HttpStatus, Inject, Patch, Post, UseGuards } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { User } from '../users/utils/user.decorator'
import { FriendDto } from './dto/Friend.dto'
import { IFriendsService } from './interface/friend'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { UpdateFriendDto } from './dto/UpdateFriend.dto'
import { MyHttpException } from '../utils/myHttpException'
@Controller(Routes.FRIENDS)
export class FriendsController {
  constructor(@Inject(Services.FRIENDS) private readonly friendsService: IFriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('request')
  async request(@User('sub') userId: number, @Body() friendDto: FriendDto) {
    if (isNaN(userId)) {
      throw new MyHttpException('Unauthorized', HttpStatus.BAD_REQUEST)
    }
    return await this.friendsService.request(userId, friendDto)
  }
  @UseGuards(JwtAuthGuard)
  @Patch('respone')
  async response(@User('sub') userId: number, @Body() updateFriendDto: UpdateFriendDto) {
    if (isNaN(userId)) {
      throw new MyHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    return await this.friendsService.response(userId, updateFriendDto)
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async listFriend(@User('sub') userId: number) {
    return await this.friendsService.list(userId)
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@User('sub') userId: number, @Body() friendDto: FriendDto) {
    await this.friendsService.delete(userId, friendDto)
  }
}
