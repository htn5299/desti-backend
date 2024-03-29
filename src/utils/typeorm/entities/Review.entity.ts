import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Place } from './Place.entity'
import { User } from './User.entity'
import { LikeEntity } from './Like.entity'
import { CommentEntity } from './Comment.entity'

@Entity({ name: 'reviews' })
@Check('"rating" >=1 AND "rating"<=5')
export class Review {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  review: string

  @Column({ nullable: true, type: 'smallint', unsigned: true })
  rating: number

  @ManyToOne(() => Place, (place) => place.reviews, { onDelete: 'CASCADE' })
  @JoinColumn()
  place: Place

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn()
  user: User

  @OneToMany(() => LikeEntity, (likeEntity) => likeEntity.review)
  likes: LikeEntity[]

  @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.review)
  comments: CommentEntity[]

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date
}
