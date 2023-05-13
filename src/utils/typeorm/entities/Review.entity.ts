import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Place } from './Place.entity'
import { User } from './User.entity'

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  review: string

  @Column({ nullable: true, type: 'smallint', unsigned: true })
  rating: number

  @ManyToOne(() => Place, (place) => place.reviews)
  @JoinColumn()
  place: Place

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn()
  user: User

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date
}
