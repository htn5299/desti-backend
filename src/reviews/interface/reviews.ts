import { Review } from '../../utils/typeorm/entities/Review.entity'
import { CreateReview } from '../../utils/types'
import { CreateReviewDto } from '../dto/CreateReview.dto'
import { ReviewQueryDto } from '../dto/ReviewQuery.dto'
export interface IReviewsService {
  create(userplaceId: CreateReview, content: CreateReviewDto): Promise<Review>
  findReview(userplaceId: CreateReview): Promise<Review>
  getAll(reviewQuery: ReviewQueryDto): Promise<Review[] | Review>
  // getAllbyPlace(placeId: number): Promise<Review[]>
  // getALLbyUser(userId: number): Promise<Review[]>
}
