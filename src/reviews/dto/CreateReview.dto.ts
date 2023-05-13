import { IsOptional } from 'class-validator'

export class CreateReviewDto {
  @IsOptional()
  review: string
  @IsOptional()
  rating: number
}
