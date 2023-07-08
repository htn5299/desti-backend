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
import { User } from './User.entity'
import { Review } from './Review.entity'
import { Favourite } from './Favourite.entity'
import { PlaceImage } from './PlaceImage.entity'
import { StatusCode } from '../../constranst'

@Entity({ name: 'places' })
export class Place {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  address: string

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

  @OneToMany(() => Favourite, (favourites) => favourites.place)
  favourites: Favourite[]

  @OneToMany(() => PlaceImage, (images) => images.place)
  images: PlaceImage[]
}
