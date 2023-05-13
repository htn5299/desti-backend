import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { StatusCode } from './StatusCode'
import { User } from './User.entity'
import { Review } from './Review.entity'

@Entity({ name: 'places' })
export class Place {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column({ type: 'float' })
  latitude: number

  @Column({ type: 'float' })
  longitude: number

  @Column({ type: 'enum', enum: StatusCode, default: StatusCode.ACCEPTED })
  status: StatusCode

  @ManyToOne(() => User, (user) => user.places)
  @JoinColumn()
  createdBy: User

  @OneToMany(() => Review, (review) => review.place)
  reviews: Review[]

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date
}
