import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './User.entity'
import { NotificationEntity } from './Notification.entity'

@Entity({ name: 'notification_recipients' })
export class NotificationRecipientEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'recipientId' })
  recipient: number

  @ManyToOne(() => NotificationEntity, (notification) => notification.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'notificationId' })
  notification: number

  @Column({ type: 'timestamptz', nullable: true })
  readAt: Date

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
