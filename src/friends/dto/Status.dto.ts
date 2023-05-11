import { IsEnum, IsNotEmpty } from 'class-validator'
import { StatusCode } from '../../utils/typeorm/entities/StatusCode'

export class StatusDto {
  @IsNotEmpty()
  @IsEnum(StatusCode)
  status: StatusCode
}
