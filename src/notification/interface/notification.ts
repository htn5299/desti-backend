import { NotificationEntity, NotificationRecipientEntity } from '../../utils/typeorm'
import { NotificationRecipientType, NotificationType } from '../../utils/types'

export interface INotification {
  createNotification(content: Omit<NotificationType, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationEntity>

  createNotificationRecipient(
    content: Omit<NotificationRecipientType, 'id' | 'createdAt' | 'updatedAt' | 'readAt'>
  ): Promise<NotificationRecipientEntity>

  getNotificationRecipientById(notificationRecipient: {
    notificationRecipientId: number
  }): Promise<NotificationRecipientEntity>

  deleteNotification(notification: { entity: number }): Promise<any>

  // getAllNotification(): Promise<any>
  getAllNotificationByUser(query: { userId: number; page: number }): Promise<NotificationRecipientEntity[]>
}
