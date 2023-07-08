import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { IComments } from './interface/comments'
import { CommentEntity } from '../utils/typeorm/entities/Comment.entity'
import { CommentType } from '../utils/types'
import { MyHttpException } from '../utils/myHttpException'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { IReviewsService } from '../reviews/interface/reviews'

@Injectable()
export class CommentsService implements IComments {
  constructor(
    @InjectRepository(CommentEntity) private readonly commentRepo: Repository<CommentEntity>,
    @Inject(Services.USERS) private userService: IUserService,
    @Inject(Services.REVIEWS) private reviewService: IReviewsService
  ) {}
  async create(content: Omit<CommentType, 'id' | 'createdAt'>): Promise<CommentEntity> {
    const { userId, reviewId, comment } = content

    const user = await this.userService.getUser({ id: userId })
    if (!user) {
      throw new MyHttpException('user not found', HttpStatus.BAD_REQUEST)
    }
    const review = await this.reviewService.getReviewById(reviewId)
    if (!review) {
      throw new MyHttpException('review not found', HttpStatus.BAD_REQUEST)
    }
    const newComment = this.commentRepo.create({ user, review, comment })
    return await this.commentRepo.save(newComment)
  }
  async getMany(comment: Partial<Pick<CommentType, 'userId' | 'reviewId'>>): Promise<CommentEntity[]> {
    const { reviewId, userId } = comment
    if (reviewId && userId) {
      return [await this.getOne({ reviewId, userId })]
    }
    if (reviewId) {
      return await this.commentRepo
        .createQueryBuilder('comments')
        .where('comments.review = :reviewId', { reviewId })
        .leftJoinAndSelect('comments.review', 'review')
        .leftJoinAndSelect('comments.user', 'user')
        .leftJoinAndSelect('user.profile', 'profile')
        .getMany()
    } else if (userId) {
      return await this.commentRepo
        .createQueryBuilder('comments')
        .where('comments.userId = :userId', { userId })
        .leftJoinAndSelect('comments.review', 'review')
        .leftJoinAndSelect('comments.user', 'user')
        .leftJoinAndSelect('user.profile', 'profile')
        .getMany()
    }
    return
  }
  async delete(comment: Pick<CommentType, 'id' | 'userId'>): Promise<CommentEntity> {
    const { id, userId } = comment
    const existingComment = await this.getOne({ id })
    if (!existingComment) {
      throw new MyHttpException('like not found', HttpStatus.BAD_REQUEST)
    }
    if (existingComment.user.id !== userId) {
      throw new MyHttpException('Not yours', HttpStatus.BAD_REQUEST)
    }
    await this.commentRepo.delete({ id: existingComment.id })
    return existingComment
  }
  async getOne(comment: Partial<Omit<CommentType, 'createdAt' | 'comment'>>): Promise<CommentEntity> {
    const { id, reviewId, userId } = comment
    if (id) {
      const existingComment = await this.commentRepo
        .createQueryBuilder('comments')
        .where('comments.id = :id', { id })
        .leftJoinAndSelect('comments.user', 'user')
        .leftJoinAndSelect('comments.review', 'review')
        .leftJoinAndSelect('user.profile', 'profile')
        .getOne()
      if (!existingComment) {
        throw new MyHttpException('comment not found', HttpStatus.BAD_REQUEST)
      }
      return existingComment
    } else if (reviewId && userId) {
      const existingComment = await this.commentRepo
        .createQueryBuilder('comments')
        .where('comments.userId = :userId', { userId })
        .andWhere('comments.reviewId = :reviewId', { reviewId })
        .leftJoinAndSelect('comments.user', 'user')
        .leftJoinAndSelect('comments.review', 'review')
        .leftJoinAndSelect('user.profile', 'profile')
        .getOne()
      if (!existingComment) {
        throw new MyHttpException('comment not found', HttpStatus.BAD_REQUEST)
      }
      return existingComment
    }
    throw new MyHttpException('comment not found', HttpStatus.BAD_REQUEST)
  }
}
