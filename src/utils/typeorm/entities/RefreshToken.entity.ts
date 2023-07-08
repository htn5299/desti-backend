import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'refresh_tokens' })
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
