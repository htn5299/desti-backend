import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotificationEntity } from '../utils/typeorm/entities/Notification.entity'
import { NotificationRecipientEntity } from '../utils/typeorm/entities/NotificationRecipient.entity'

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
