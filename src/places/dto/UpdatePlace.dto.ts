import { IsLatitude, IsLongitude, IsNumber, IsOptional } from 'class-validator'

export class UpdatePlaceDto {
  @IsOptional()
  name: string

  @IsOptional()
  description: string

  @IsOptional()
  @IsLatitude()
  latitude: number

  @IsOptional()
  @IsLongitude()
  longitude: number
}
