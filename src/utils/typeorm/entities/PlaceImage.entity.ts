import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Place } from './Place.entity'

@Entity({ name: 'placeimages' })
export class PlaceImage {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  placeId: number
  @ManyToOne(() => Place, (place) => place.images)
  @JoinColumn({ name: 'placeId' })
  place: Place
  @Column()
  key: string
}
