import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateReviewDto {
  @IsOptional()
  review: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number
}
