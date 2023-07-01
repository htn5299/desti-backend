import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards, ParseIntPipe } from '@nestjs/common'
import { Action, Routes, ServerEvents, Services, StatusCode } from '../utils/constranst'
import { IFriendsService } from './interface/friend'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { UpdateFriendDto } from './dto/UpdateFriend.dto'
import { INotification } from '../notification/interface/notification'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { User } from '../users/utils/user.decorator'

@Controller(Routes.FRIENDS)
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(
    @Inject(Services.FRIENDS) private readonly friendsService: IFriendsService,
    @Inject(Services.NOTIFICATION) private readonly notificationsService: INotification,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post(':id')
  async request(@User('sub') userId: number, @Param('id', ParseIntPipe) friendId: number) {
    const friendRequest = await this.friendsService.request(userId, friendId)
    const newNotification = await this.notificationsService.createNotification({
      service: Services.FRIENDS,
      action: Action.POST,
      actor: userId,
      entity: friendRequest.id
    })
    const newNotificationRecipient = await this.notificationsService.createNotificationRecipient({
      recipient: friendId,
      notification: newNotification.id
    })
    this.eventEmitter.emit(ServerEvents.FRIEND_REQUEST, {
      notificationRecipientId: newNotificationRecipient.id,
      recipientId: friendId
    })
    return friendRequest
  }
  @Patch(':id')
  async response(
    @User('sub') userId: number,
    @Param('id', ParseIntPipe) friendId: number,
    @Body() updateFriendDto: UpdateFriendDto
  ) {
    const friendResponse = await this.friendsService.response(userId, friendId, updateFriendDto)
    const newNotification = await this.notificationsService.createNotification({
      actor: userId,
      action: Action.UPDATE,
      service: Services.FRIENDS,
      entity: friendResponse.id
    })
    const newNotificationRecipient = await this.notificationsService.createNotificationRecipient({
      notification: newNotification.id,
      recipient: friendId
    })
    friendResponse.status === StatusCode.ACCEPTED &&
      this.eventEmitter.emit(ServerEvents.FRIEND_RESPONSE, {
        notificationRecipientId: newNotificationRecipient.id,
        recipientId: friendId
      })
    return friendResponse
  }
  @Get(':id')
  async listFriend(@Param('id', ParseIntPipe) userId: number) {
    return await this.friendsService.list(userId)
  }
  @Delete(':id')
  async delete(@User('sub') userId: number, @Param('id', ParseIntPipe) friendId: number) {
    await this.friendsService.delete(userId, friendId)
  }
}
