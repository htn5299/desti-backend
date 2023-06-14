import { Review } from '../../utils/typeorm/entities/Review.entity'

export interface INewsfeed {
  newsfeed(userId: number, page: number): Promise<Review[]>
}
