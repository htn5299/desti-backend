import { IsBoolean, IsNumber, IsOptional } from 'class-validator'

export class FavouriteDto {
  @IsNumber()
  placeId: number
  @IsBoolean()
  @IsOptional()
  here: boolean
  @IsBoolean()
  @IsOptional()
  want: boolean
}
