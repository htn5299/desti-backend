import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './User.entity'
import { StatusCode } from '../../constranst'

@Entity({ name: 'friends' })
export class Friend {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.friends)
  @JoinColumn({ name: 'requesterId' })
  requester: User

  @ManyToOne(() => User, (user) => user.friendRequests)
  @JoinColumn({ name: 'receiverId' })
  receiver: User

  @Column({ type: 'enum', enum: StatusCode, default: StatusCode.ACCEPTED })
  status: StatusCode

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
