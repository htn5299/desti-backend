import { Review } from '../../utils/typeorm/entities/Review.entity'
import { UserPlaceIndex } from '../../utils/types'
import { CreateReviewDto } from '../dto/CreateReview.dto'
import { ReviewQueryDto } from '../dto/ReviewQuery.dto'

export interface IReviewsService {
  create(userPlaceIndex: UserPlaceIndex, content: CreateReviewDto): Promise<Review>

  findReview(userPlaceIndex: UserPlaceIndex): Promise<Review>

  getAll(reviewQuery: ReviewQueryDto): Promise<Review[] | Review>
}
