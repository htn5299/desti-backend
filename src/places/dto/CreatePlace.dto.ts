import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber } from 'class-validator'

export class CreatePlaceDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  description: string

  @IsNotEmpty()
  @IsLatitude()
  latitude: number

  @IsNotEmpty()
  @IsLongitude()
  longitude: number
}
