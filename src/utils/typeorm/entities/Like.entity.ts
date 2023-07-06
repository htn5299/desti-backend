import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Review } from './Review.entity'
import { User } from './User.entity'

@Entity({ name: 'likes' })
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Review, (review) => review.likes, { onDelete: 'CASCADE' })
  @JoinColumn()
  review: Review

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date
}
