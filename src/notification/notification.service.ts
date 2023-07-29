import { Injectable } from '@nestjs/common'
import { NotificationEntity, NotificationRecipientEntity } from '../utils/typeorm'
import { INotification } from './interface/notification'
import { NotificationRecipientType, NotificationType } from '../utils/types'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class NotificationService implements INotification {
  constructor(
    @InjectRepository(NotificationEntity) private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(NotificationRecipientEntity)
    private readonly notificationRecipientRepository: Repository<NotificationRecipientEntity>
  ) {}

  async createNotification(
    body: Omit<NotificationType, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<NotificationEntity> {
    const { actor, entity, service, action, content } = body
    const createNotification = await this.notificationRepository.create({ actor, action, service, entity, content })
    return await this.notificationRepository.save(createNotification)
  }

  async createNotificationRecipient(
    content: Omit<NotificationRecipientType, 'id' | 'createdAt' | 'updatedAt' | 'readAt'>
  ): Promise<NotificationRecipientEntity> {
    const { recipient, notification } = content
    const createNotificationRecipient = await this.notificationRecipientRepository.create({
      recipient,
      notification
    })
    return await this.notificationRecipientRepository.save(createNotificationRecipient)
  }

  async getAllNotificationByUser(query: { userId: number; page: number }): Promise<NotificationRecipientEntity[]> {
    const { userId, page } = query
    return await this.notificationRecipientRepository
      .createQueryBuilder('nr')
      .where('nr.recipient = :userId', { userId })
      .leftJoinAndSelect('nr.notification', 'n')
      .leftJoinAndSelect('n.actor', 'actor')
      .take(5)
      .skip(5 * (page - 1))
      .orderBy('nr.createdAt', 'DESC')
      .getMany()
  }

  async getNotificationRecipientById(notificationRecipient: {
    notificationRecipientId: number
  }): Promise<NotificationRecipientEntity> {
    const { notificationRecipientId } = notificationRecipient
    return await this.notificationRecipientRepository
      .createQueryBuilder('nr')
      .where('nr.id = :notificationRecipientId', { notificationRecipientId })
      .leftJoinAndSelect('nr.notification', 'n')
      .leftJoinAndSelect('n.actor', 'actor')
      .orderBy('nr.createdAt', 'DESC')
      .getOne()
  }

  async deleteNotification(notification: { entity: number }): Promise<any> {
    const { entity } = notification
    return await this.notificationRepository
      .createQueryBuilder('notifications')
      .delete()
      .from(NotificationEntity)
      .where('entity = :entity', { entity })
      .execute()
  }
}
