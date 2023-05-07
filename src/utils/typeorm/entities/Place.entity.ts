import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { StatusCode } from './StatusCode'
import { User } from './User.entity'

@Entity({ name: 'places' })
export class Place {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  longitude: number

  @Column()
  latitude: number

  @Column({ type: 'enum', enum: StatusCode, default: StatusCode.PENDING })
  status: StatusCode

  @OneToOne(() => User, (user) => user.placeId)
  @JoinColumn()
  createdBy: User

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
