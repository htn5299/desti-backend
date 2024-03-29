import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Place } from './Place.entity'

@Entity({ name: 'place_images' })
export class PlaceImage {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  placeId: string
  @ManyToOne(() => Place, (place) => place.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'placeId' })
  place: Place
  @Column()
  key: string
}
