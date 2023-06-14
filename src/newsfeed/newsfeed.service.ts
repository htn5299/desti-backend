import { Inject } from '@nestjs/common'
import { INewsfeed } from './interface/newsfeed'
import { Review } from '../utils/typeorm/entities/Review.entity'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { IFriendsService } from '../friends/interface/friend'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class NewsfeedService implements INewsfeed {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
    @Inject(Services.FRIENDS) private readonly friendsServices: IFriendsService,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>
  ) {}

  async newsfeed(userId: number, page): Promise<Review[]> {
    const friends = await this.friendsServices.list(userId)
    const friendIds = friends.map((friend) => friend.id)
    return this.reviewRepository
      .createQueryBuilder('reviews')
      .where('reviews.userId IN (:...friendIds)', { friendIds })
      .leftJoinAndSelect('reviews.place', 'place')
      .leftJoinAndSelect('reviews.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .take(3)
      .skip(3 * (page - 1))
      .orderBy('reviews.updatedAt', 'DESC')
      .getMany()
  }
}
