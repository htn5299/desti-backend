import { Column, OneToOne, PrimaryGeneratedColumn, Entity } from 'typeorm'
import { User } from './User.entity'

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: '' })
  about?: string

  @Column({ nullable: true })
  avatar?: string

  @OneToOne(() => User, (user) => user.profile)
  user: User
}
