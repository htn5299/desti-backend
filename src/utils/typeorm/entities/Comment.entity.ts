import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Review } from './Review.entity'
import { User } from './User.entity'

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Review, (review) => review.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  review: Review

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @Column()
  comment: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date
}
