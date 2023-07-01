import { NotificationEntity } from '../../utils/typeorm/entities/Notification.entity'
import { NotificationRecipientEntity } from '../../utils/typeorm/entities/NotificationRecipient.entity'
import { NotificationRecipientType, NotificationType } from '../../utils/types'

export interface INotification {
  createNotification(content: Omit<NotificationType, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationEntity>
  createNotificationRecipient(
    content: Omit<NotificationRecipientType, 'id' | 'createdAt' | 'updatedAt' | 'readAt'>
  ): Promise<NotificationRecipientEntity>
  getNotificationRecipientById(notificationRecipient: {
    notificationRecipientId: number
  }): Promise<NotificationRecipientEntity>
  // deleteNotification(): Promise<any>
  // getAllNotification(): Promise<any>
  getAllNotificationByUser(user: { userId: number }): Promise<NotificationRecipientEntity[]>
}
