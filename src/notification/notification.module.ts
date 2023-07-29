import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotificationEntity, NotificationRecipientEntity } from '../utils/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, NotificationRecipientEntity])],
  controllers: [NotificationController],
  providers: [
    {
      provide: Services.NOTIFICATION,
      useClass: NotificationService
    }
  ],
  exports: [
    {
      provide: Services.NOTIFICATION,
      useClass: NotificationService
    }
  ]
})
export class NotificationModule {}
