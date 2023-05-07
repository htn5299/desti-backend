import { Exclude } from 'class-transformer'
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { Profile } from './Profile.entity'
import { Friend } from './Friend.entity'
import { Place } from './Place.entity'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  name: string

  @Column({ select: false })
  @Exclude()
  password: string

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile

  @OneToMany(() => Friend, (friend) => friend.requester)
  friends: Friend[]

  @OneToMany(() => Friend, (friend) => friend.receiver)
  friendRequests: Friend[]

  @OneToOne(() => Place, (place) => place.createdBy)
  placeId: number
}
