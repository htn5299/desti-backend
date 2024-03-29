import { Review } from '../../utils/typeorm'
import { UserPlaceIndex } from '../../utils/types'
import { CreateReviewDto } from '../dto/CreateReview.dto'

export interface IReviewsService {
  createReview(userPlaceIndex: UserPlaceIndex, content: CreateReviewDto): Promise<Review>

  getReviewById(reviewId: number): Promise<Review>

  getReviewsByPlaceId(placeId: number): Promise<Review[]>

  getReviewsByUserId(userId: number): Promise<Review[]>

  getMyReviewsByUserPlaceIndex(userPlaceIndex: UserPlaceIndex): Promise<Review>

  updateMyReviewsByPlaceIndex(userPlaceIndex: UserPlaceIndex, content: CreateReviewDto): Promise<Review>

  deleteMyReviewsByPlaceIndex(userPlaceIndex: UserPlaceIndex): Promise<Review>

  topPlaces(top: number): Promise<{ placeId: number }[]>

  newsfeed(userId: number, page: number): Promise<Review[]>
}
