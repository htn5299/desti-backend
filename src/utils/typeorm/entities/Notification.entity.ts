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
import { Action, Services } from '../../constranst'

@Entity({ name: 'notifications' })
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'actorId' })
  actor: number

  @Column()
  entity: number

  @Column({ nullable: true })
  content: string

  @Column({ type: 'enum', enum: Action, default: Action.POST })
  action: Action

  @Column({ type: 'enum', enum: Services })
  service: Services

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
