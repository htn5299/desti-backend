import { IsEnum, IsNotEmpty } from 'class-validator'
import { StatusCode } from '../../utils/constranst'

export class StatusDto {
  @IsNotEmpty()
  @IsEnum(StatusCode)
  status: StatusCode
}
