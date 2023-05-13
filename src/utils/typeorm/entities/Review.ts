import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ nullable: true })
  review: string
  @Column({ nullable: true, type: 'smallint', unsigned: true })
  rating: number
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date
}
