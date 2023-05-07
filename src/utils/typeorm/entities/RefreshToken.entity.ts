import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'refreshtokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false, unique: true })
  token: string

  @Column({ nullable: false })
  userId: number

  @Column({ nullable: false })
  email: string
}
