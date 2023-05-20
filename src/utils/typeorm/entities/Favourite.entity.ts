import { Entity, ManyToOne, Column, PrimaryColumn } from 'typeorm'
import { User } from './User.entity'
import { Place } from './Place.entity'

@Entity({ name: 'favourites' })
export class Favourite {
  @PrimaryColumn()
  userId: number

  @PrimaryColumn()
  placeId: number

  @ManyToOne(() => User, (user) => user.favourites)
  user: User

  @ManyToOne(() => Place, (place) => place.favourites)
  place: Place

  @Column({ default: false })
  here: boolean

  @Column({ default: false })
  want: boolean
}
