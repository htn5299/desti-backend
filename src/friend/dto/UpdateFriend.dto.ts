import { IsEnum, IsNotEmpty } from 'class-validator'
import { StatusCode } from '../../utils/typeorm/entities/StatusCode'
export class UpdateFriendDto {
  @IsNotEmpty()
  friendId: number

  @IsNotEmpty()
  @IsEnum(StatusCode)
  status: StatusCode
}
