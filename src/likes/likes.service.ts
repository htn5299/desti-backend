import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ILikes } from './interface/likes'
import { LikeEntity } from '../utils/typeorm/entities/Like.entity'
import { LikeType } from '../utils/types'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { IReviewsService } from '../reviews/interface/reviews'
import { MyHttpException } from '../utils/myHttpException'

@Injectable()
export class LikesService implements ILikes {
  constructor(
    @InjectRepository(LikeEntity) private readonly likeRepo: Repository<LikeEntity>,
    @Inject(Services.USERS) private userService: IUserService,
    @Inject(Services.REVIEWS) private reviewService: IReviewsService
  ) {}

  async create(like: Pick<LikeType, 'userId' | 'reviewId'>): Promise<LikeEntity> {
    const { userId, reviewId } = like
    const existingLike = await this.getOne(like)
    if (existingLike) {
      throw new MyHttpException('Liked', HttpStatus.BAD_REQUEST)
    }
    const user = await this.userService.getUser({ id: userId })
    if (!user) {
      throw new MyHttpException('user not found', HttpStatus.BAD_REQUEST)
    }
    const review = await this.reviewService.getReviewById(reviewId)
    if (!review) {
      throw new MyHttpException('review not found', HttpStatus.BAD_REQUEST)
    }
    const newLike = this.likeRepo.create({ user, review })
    return await this.likeRepo.save(newLike)
  }

  async getOne(like: Partial<Omit<LikeType, 'createdAt'>>): Promise<LikeEntity> {
    const { id, reviewId, userId } = like
    if (id) {
      const existingLike = await this.likeRepo
        .createQueryBuilder('likes')
        .where('likes.id = :id', { id })
        .leftJoinAndSelect('likes.user', 'user')
        .leftJoinAndSelect('likes.review', 'review')
        .getOne()
      if (!existingLike) {
        throw new MyHttpException('like not found', HttpStatus.BAD_REQUEST)
      }
      return existingLike
    } else if (reviewId && userId) {
      const existingLike = await this.likeRepo
        .createQueryBuilder('likes')
        .where('likes.review = :userId', { userId })
        .andWhere('likes.review = :reviewId', { reviewId })
        .leftJoinAndSelect('likes.user', 'user')
        .leftJoinAndSelect('likes.review', 'review')
        .getOne()
      if (!existingLike) {
        throw new MyHttpException('like not found', HttpStatus.BAD_REQUEST)
      }
      return existingLike
    }
    throw new MyHttpException('like not found', HttpStatus.BAD_REQUEST)
  }

  async getMany(like: Partial<Pick<LikeType, 'userId' | 'reviewId'>>): Promise<LikeEntity[]> {
    const { reviewId, userId } = like
    if (reviewId && userId) {
      return [await this.getOne({ reviewId, userId })]
    }
    if (reviewId) {
      return await this.likeRepo
        .createQueryBuilder('likes')
        .where('likes.review = :reviewId', { reviewId })
        .leftJoinAndSelect('likes.review', 'review')
        .leftJoinAndSelect('likes.user', 'user')
        .getMany()
    } else if (userId) {
      return await this.likeRepo
        .createQueryBuilder('likes')
        .where('likes.userId = :userId', { userId })
        .leftJoinAndSelect('likes.review', 'review')
        .leftJoinAndSelect('likes.user', 'user')
        .getMany()
    }
    return
  }

  async delete(like: Pick<LikeType, 'id' | 'userId'>): Promise<LikeEntity> {
    const { id, userId } = like
    const myLike = await this.getOne({ id })
    if (!myLike) {
      throw new MyHttpException('like not found', HttpStatus.BAD_REQUEST)
    }
    if (myLike.user.id !== userId) {
      throw new MyHttpException('Not yours', HttpStatus.BAD_REQUEST)
    }
    await this.likeRepo.delete({ id: myLike.id })
    return myLike
  }
}
