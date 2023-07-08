import { Controller, Get, Inject, UseGuards } from '@nestjs/common'
import { Routes, Services } from 'utils/constranst'
import { INotification } from './interface/notification'
import { User } from '../users/utils/user.decorator'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'

@Controller(Routes.NOTIFICATION)
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(@Inject(Services.NOTIFICATION) private readonly notificationService: INotification) {}
  @Get()
  async test(@User('sub') userId: number) {
    return await this.notificationService.getAllNotificationByUser({ userId })
  }
}
