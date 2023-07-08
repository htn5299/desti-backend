import { IsBoolean, IsNumber } from 'class-validator'

export class CreateLikeDto {
  @IsNumber()
  reviewId: number
  @IsBoolean()
  isLiked: boolean
}
