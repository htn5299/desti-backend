import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn } from 'typeorm'
import { User } from './User.entity'
import { Place } from './Place.entity'

@Entity({ name: 'favourites' })
export class Favourite {
  @PrimaryColumn()
  userId: number

  @PrimaryColumn()
  placeId: number

  @ManyToOne(() => User, (user) => user.favourites)
  @JoinColumn()
  user: User

  @ManyToOne(() => Place, (place) => place.favourites)
  @JoinColumn()
  place: Place

  @Column({ default: false })
  here: boolean

  @Column({ default: false })
  want: boolean
}
