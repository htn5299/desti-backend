import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { IReviewsService } from './interface/reviews'
import { Review } from '../utils/typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserPlaceIndex } from '../utils/types'
import { CreateReviewDto } from './dto/CreateReview.dto'
import { IUserService } from '../users/interfaces/user'
import { Services } from '../utils/constranst'
import { IPlacesService } from '../places/interface/places'
import { MyHttpException } from '../utils/myHttpException'
import { IFriendsService } from '../friends/interface/friend'

@Injectable()
export class ReviewsService implements IReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @Inject(Services.FRIENDS) private readonly friendsService: IFriendsService,
    @Inject(Services.USERS) private readonly usersService: IUserService,
    @Inject(Services.PLACES) private readonly placesService: IPlacesService
  ) {}

  async createReview(userPlaceIndex: UserPlaceIndex, content: CreateReviewDto): Promise<Review> {
    const myReview = await this.getMyReviewsByUserPlaceIndex(userPlaceIndex)
    if (myReview) {
      throw new MyHttpException('You have reviewed this place', HttpStatus.BAD_REQUEST)
    }
    const user = await this.usersService.findOne({ id: userPlaceIndex.userId })
    const place = await this.placesService.findOne({ id: userPlaceIndex.placeId })
    const createReview = this.reviewRepository.create({ ...content, user, place })

    return await this.reviewRepository.save(createReview)
  }

  async getReviewById(reviewId: number): Promise<Review> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.place', 'place')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.id = :reviewId', {
        reviewId
      })
      .getOne()
  }

  async getReviewsByPlaceId(placeId: number): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.place', 'place')
      .leftJoinAndSelect('review.user', 'user')
      .select('review')
      .where('place.id = :id', { id: placeId })
      .addSelect('user')
      .addSelect('place')
      .orderBy('review.updatedAt', 'DESC')
      .getMany()
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.place', 'place')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .select('review')
      .where('user.id = :id', { id: userId })
      .addSelect('user')
      .addSelect('place')
      .addSelect('profile')
      .orderBy('review.updatedAt', 'DESC')
      .getMany()
  }

  async getMyReviewsByUserPlaceIndex(userPlaceIndex: UserPlaceIndex): Promise<Review> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.place', 'place')
      .leftJoinAndSelect('review.user', 'user')
      .where('user.id = :userId AND place.id = :placeId', {
        userId: userPlaceIndex.userId,
        placeId: userPlaceIndex.placeId
      })
      .getOne()
  }

  async updateMyReviewsByPlaceIndex(userPlaceIndex: UserPlaceIndex, content: CreateReviewDto): Promise<Review> {
    const myReview = await this.getMyReviewsByUserPlaceIndex(userPlaceIndex)
    if (!myReview) {
      throw new MyHttpException('No review found to update', HttpStatus.BAD_REQUEST)
    }
    return await this.reviewRepository.save({ ...myReview, ...content })
  }

  async deleteMyReviewsByPlaceIndex(userPlaceIndex: UserPlaceIndex) {
    const existingReview = await this.getMyReviewsByUserPlaceIndex(userPlaceIndex)
    if (!existingReview) {
      throw new MyHttpException('No review found to delete', HttpStatus.BAD_REQUEST)
    }
    await this.reviewRepository.delete(existingReview.id)
    return existingReview
  }

  async topPlaces(top: number): Promise<{ placeId: number }[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .select('review."placeId"', 'placeId')
      .leftJoin('review.place', 'place')
      .groupBy('review."placeId"')
      .orderBy('COUNT(*)', 'DESC')
      .limit(top)
      .getRawMany()
  }

  async newsfeed(userId: number, page): Promise<Review[]> {
    const friends = await this.friendsService.list(userId)
    const friendIds = friends.map((friend) => friend.id)
    return friendIds.length
      ? await this.reviewRepository
          .createQueryBuilder('reviews')
          .where('reviews.userId IN (:...friendIds)', { friendIds: friendIds }) // Remove spread operator
          .leftJoinAndSelect('reviews.place', 'place')
          .leftJoinAndSelect('reviews.user', 'user')
          .leftJoinAndSelect('user.profile', 'profile')
          .take(5)
          .skip(5 * (page - 1))
          .orderBy('reviews.updatedAt', 'DESC')
          .getMany()
      : []
  }
}
