import { IsBoolean, IsOptional } from 'class-validator'

export class FavouriteDto {
  @IsBoolean()
  @IsOptional()
  here: boolean
  @IsBoolean()
  @IsOptional()
  want: boolean
}
