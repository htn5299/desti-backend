import { Exclude } from 'class-transformer'
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { Profile } from './Profile.entity'
import { Friend } from './Friend.entity'
import { Place } from './Place.entity'
import { Review } from './Review.entity'
import { Favourite } from './Favourite.entity'
import { LikeEntity } from './Like.entity'
import { CommentEntity } from './Comment.entity'
import { Message } from './Message.entity'

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

  @OneToMany(() => Place, (place) => place.createdBy)
  places: Place[]

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[]

  @OneToMany(() => LikeEntity, (likeEntity) => likeEntity.user)
  likes: LikeEntity[]

  @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.user)
  comments: CommentEntity[]

  @OneToMany(() => Favourite, (favourites) => favourites.user)
  favourites: Favourite[]

  @OneToMany(() => Message, (message) => message.author)
  @JoinColumn()
  messages: Message[]
}
