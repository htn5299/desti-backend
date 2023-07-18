import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User.entity'
import { Conversation } from './Conversation.entity'
@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
  conversation: Conversation

  @Column('text', { nullable: true })
  content: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @ManyToOne(() => User, (user) => user.messages)
  author: User
}
