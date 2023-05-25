import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { IReviewsService } from './interface/reviews'
import { Review } from '../utils/typeorm/entities/Review.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserPlaceIndex } from '../utils/types'
import { CreateReviewDto } from './dto/CreateReview.dto'
import { IUserService } from '../users/interfaces/user'
import { Services } from '../utils/constranst'
import { IPlacesService } from '../places/interface/places'
import { MyHttpException } from '../utils/myHttpException'
import { ReviewQueryDto } from './dto/ReviewQuery.dto'

@Injectable()
export class ReviewsService implements IReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @Inject(Services.USERS) private readonly usersService: IUserService,
    @Inject(Services.PLACES) private readonly placesService: IPlacesService
  ) {}

  async getAll(reviewQuery: ReviewQueryDto) {
    const reviewBuilder = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.place', 'place')
      .leftJoinAndSelect('review.user', 'user')
      .select('review')
    if (reviewQuery.user && reviewQuery.place) {
      return await reviewBuilder
        .where('user.id = :userId AND place.id = :placeId', {
          userId: reviewQuery.user,
          placeId: reviewQuery.place
        })
        .addSelect('user')
        .addSelect('place')
        .getOne()
    } else if (reviewQuery.user) {
      return await reviewBuilder.where('user.id = :id', { id: reviewQuery.user }).addSelect('place').getMany()
    } else if (reviewQuery.place) {
      return await reviewBuilder.where('place.id = :id', { id: reviewQuery.place }).addSelect('user').getMany()
    } else {
      throw new MyHttpException(`Can't query`, HttpStatus.BAD_REQUEST)
    }
  }

  async create(userplaceId: UserPlaceIndex, content: CreateReviewDto): Promise<Review> {
    const review = await this.findReview({ userId: userplaceId.userId, placeId: userplaceId.placeId })
    if (review) {
      return await this.reviewRepository.save({ ...review, ...content })
    }
    const user = await this.usersService.findOne({ id: userplaceId.userId })
    const place = await this.placesService.findOne({ id: userplaceId.placeId })
    const newReview = this.reviewRepository.create({ ...content, user, place })
    return await this.reviewRepository.save(newReview)
  }

  async findReview(userplaceId: { userId: number; placeId: number }): Promise<Review> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.place', 'place')
      .leftJoinAndSelect('review.user', 'user')
      .where('user.id = :userId AND place.id = :placeId', { userId: userplaceId.userId, placeId: userplaceId.placeId })
      .getOne()
  }

  async reviewNewfeed(page: number): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.place', 'place')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .take(3)
      .skip(3 * (page - 1))
      .orderBy('review.updatedAt', 'DESC')
      .getMany()
  }
}
