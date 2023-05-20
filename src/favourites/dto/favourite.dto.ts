import { IsBoolean, IsInt, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class FavouriteDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  placeId: number
  @IsBoolean()
  @IsOptional()
  here: boolean
  @IsBoolean()
  @IsOptional()
  want: boolean
}
