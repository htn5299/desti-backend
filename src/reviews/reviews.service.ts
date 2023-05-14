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

@Injectable()
export class ReviewsService implements IReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @Inject(Services.USERS) private readonly usersService: IUserService,
    @Inject(Services.PLACES) private readonly placesService: IPlacesService
  ) {}
  async getAllbyPlace(placeId: number): Promise<Review[]> {
    // const place = await this.placesService.findOne({ id: placeId })
    console.log(await this.findReview({ userId: 2, placeId: 8 }))
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.place', 'place')
      .leftJoinAndSelect('review.user', 'user')
      .where('place.id = :id', { id: placeId })
      .select('review')
      .addSelect('user')
      .getMany()
  }
  async getALLbyUser(userId: number): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.place', 'place')
      .where('user.id = :id', { id: userId })
      .select('review')
      .addSelect('place')
      .getMany()
  }
  async createReview(createReview: CreateReview, content: CreateReviewDto): Promise<Review> {
    const review = await this.findReview({ userId: createReview.userId, placeId: createReview.placeId })
    if (review) {
      throw new MyHttpException('You reviewd this place', HttpStatus.BAD_REQUEST)
    }
    const user = await this.usersService.findOne({ id: createReview.userId })
    const place = await this.placesService.findOne({ id: createReview.placeId })
    const newReview = this.reviewRepository.create({ ...content, user, place })
    return await this.reviewRepository.save(newReview)
  }
  async findReview(userplaceId: { userId: number; placeId: number }): Promise<Review> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.place', 'place')
      .leftJoinAndSelect('review.user', 'user')
      .where('user.id =  :userId', { userid: userplaceId.userId })
      .where('place.id = :placeId', { placeId: userplaceId.placeId })
      .getOne()
  }
}
