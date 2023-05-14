import { IsEnum, IsNotEmpty } from 'class-validator'
import { StatusCode } from '../../utils/typeorm/entities/StatusCode'
export class UpdateFriendDto {
  @IsNotEmpty()
  @IsEnum(StatusCode)
  status: StatusCode
}
