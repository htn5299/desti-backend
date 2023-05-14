import { Review } from '../../utils/typeorm/entities/Review.entity'
import { CreateReview } from '../../utils/types'
import { CreateReviewDto } from '../dto/CreateReview.dto'
export interface IReviewsService {
  createReview(createReview: CreateReview, content: CreateReviewDto): Promise<Review>
  findReview(userplaceId: { userId: number; placeId: number }): Promise<Review>
  getAllbyPlace(placeId: number): Promise<Review[]>
  getALLbyUser(userId: number): Promise<Review[]>
}
