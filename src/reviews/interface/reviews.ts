import { Review } from '../../utils/typeorm/entities/Review.entity'
import { UserPlaceIndex } from '../../utils/types'
import { CreateReviewDto } from '../dto/CreateReview.dto'
import { ReviewQueryDto } from '../dto/ReviewQuery.dto'

export interface IReviewsService {
  create(userplaceId: UserPlaceIndex, content: CreateReviewDto): Promise<Review>

  findReview(userplaceId: UserPlaceIndex): Promise<Review>

  getAll(reviewQuery: ReviewQueryDto): Promise<Review[] | Review>

  reviewNewfeed(page: number): Promise<Review[]>
}
