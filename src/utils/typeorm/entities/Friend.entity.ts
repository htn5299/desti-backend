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
import { StatusCode } from './StatusCode'

@Entity({ name: 'friends' })
export class Friend {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  requesterId: number
  @Column()
  receiverId: number

  @ManyToOne(() => User, (user) => user.friends)
  @JoinColumn({ name: 'requesterId' })
  requester: User

  @ManyToOne(() => User, (user) => user.friendRequests)
  @JoinColumn({ name: 'receiverId' })
  receiver: User

  @Column({ type: 'enum', enum: StatusCode, default: StatusCode.PENDING })
  status: StatusCode

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
