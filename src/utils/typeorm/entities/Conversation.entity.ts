import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './User.entity'
import { Message } from './Message.entity'

@Entity({ name: 'conversations' })
@Index(['creator.id', 'recipient.id'], { unique: true })
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: User

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  recipient: User

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: ['insert', 'remove', 'update']
  })
  @JoinColumn()
  messages: Message[]

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @OneToOne(() => Message)
  @JoinColumn()
  lastMessageSent: Message

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  lastMessageSentAt: Date
}
