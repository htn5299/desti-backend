import { Injectable } from '@nestjs/common'
import { NotificationEntity } from '../utils/typeorm/entities/Notification.entity'
import { INotification } from './interface/notification'
import { NotificationRecipientType, NotificationType } from '../utils/types'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationRecipientEntity } from '../utils/typeorm/entities/NotificationRecipient.entity'

@Injectable()
export class NotificationService implements INotification {
  constructor(
    @InjectRepository(NotificationEntity) private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(NotificationRecipientEntity)
    private readonly notificationRecipientRepository: Repository<NotificationRecipientEntity>
  ) {}
  async createNotification(
    content: Omit<NotificationType, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<NotificationEntity> {
    const { actor, entity, service, action } = content
    const createNotification = await this.notificationRepository.create({ actor, action, service, entity })
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
  async getAllNotificationByUser(user: { userId: number }): Promise<NotificationRecipientEntity[]> {
    const { userId } = user
    return await this.notificationRecipientRepository
      .createQueryBuilder('nr')
      .where('nr.recipient = :userId', { userId })
      .leftJoinAndSelect('nr.notification', 'n')
      .leftJoinAndSelect('n.actor', 'actor')
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
}
