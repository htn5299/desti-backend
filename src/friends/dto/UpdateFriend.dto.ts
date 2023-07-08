import { IsEnum, IsNotEmpty } from 'class-validator'
import { StatusCode } from '../../utils/constranst'
export class UpdateFriendDto {
  @IsNotEmpty()
  @IsEnum(StatusCode)
  status: StatusCode
}
