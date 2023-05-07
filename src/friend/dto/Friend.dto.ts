import { IsNotEmpty } from 'class-validator'

export class FriendDto {
  @IsNotEmpty()
  friendId: number
}
