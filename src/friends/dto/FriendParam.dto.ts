import { IsNumberString } from 'class-validator'

export class FriendParamDto {
  @IsNumberString()
  id: number
}
