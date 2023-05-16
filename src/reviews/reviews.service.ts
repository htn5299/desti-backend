import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { IReviewsService } from './interface/reviews'
import { Review } from '../utils/typeorm/entities/Review.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateReview } from '../utils/types'
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
    }
    throw new MyHttpException('Can not query', HttpStatus.BAD_REQUEST)
  }
  // async getAllbyPlace(placeId: number): Promise<Review[]> {
  //   return await this.reviewRepository
  //     .createQueryBuilder('review')
  //     .leftJoinAndSelect('review.place', 'place')
  //     .leftJoinAndSelect('review.user', 'user')
  //     .where('place.id = :id', { id: placeId })
  //     .select('review')
  //     .addSelect('user')
  //     .getMany()
  // }
  // async getALLbyUser(userId: number): Promise<Review[]> {
  //   return await this.reviewRepository
  //     .createQueryBuilder('review')
  //     .leftJoinAndSelect('review.user', 'user')
  //     .leftJoinAndSelect('review.place', 'place')
  //     .where('user.id = :id', { id: userId })
  //     .select('review')
  //     .addSelect('place')
  //     .getMany()
  // }
  async create(userplaceId: CreateReview, content: CreateReviewDto): Promise<Review> {
    const review = await this.findReview({ userId: userplaceId.userId, placeId: userplaceId.placeId })
    if (review) {
      throw new MyHttpException('You reviewd this place', HttpStatus.BAD_REQUEST)
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
}
