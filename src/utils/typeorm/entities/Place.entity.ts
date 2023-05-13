import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @Column({ type: 'float' })
  latitude: number

  @Column({ type: 'float' })
  longitude: number

  @Column({ type: 'enum', enum: StatusCode, default: StatusCode.ACCEPTED })
  status: StatusCode

  @ManyToOne(() => User, (user) => user.places)
  @JoinColumn()
  createdBy: User

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
