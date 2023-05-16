import { IsInt, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class ReviewQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  place?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  user?: number
}
