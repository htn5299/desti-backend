import { Inject, Injectable } from '@nestjs/common'
import { IReviewsService } from './interface/reviews'
import { Review } from '../utils/typeorm/entities/Review.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateReview } from '../utils/types'
import { CreateReviewDto } from './dto/CreateReview.dto'
import { IUserService } from '../users/interfaces/user'
import { Services } from '../utils/constranst'
import { IPlacesService } from '../places/interface/places'

@Injectable()
export class ReviewsService implements IReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @Inject(Services.USERS) private readonly usersService: IUserService,
    @Inject(Services.PLACES) private readonly placesService: IPlacesService
  ) {}
  async getAllbyPlace(placeId: number): Promise<Review[]> {
    // const place = await this.placesService.findOne({ id: placeId })
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.place', 'place')
      .leftJoinAndSelect('review.user', 'user')
      .where('place.id = :id', { id: placeId })
      .getMany()
  }
  async getALLbyUser(userId: number): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.place', 'place')
      .where('user.id = :id', { id: userId })
      .getMany()
  }
  async createReview(createReview: CreateReview, content: CreateReviewDto): Promise<Review> {
    const { review, rating } = content
    const user = await this.usersService.getUser({ id: createReview.userId })
    const place = await this.placesService.findOne({ id: createReview.placeId })
    const newReview = this.reviewRepository.create({ review, rating, user, place })
    return await this.reviewRepository.save(newReview)
  }
}
