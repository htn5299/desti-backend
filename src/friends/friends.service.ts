import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Friend } from '../utils/typeorm/entities/Friend.entity'
import { Repository } from 'typeorm'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { FriendDto } from './dto/Friend.dto'
import { UpdateFriendDto } from './dto/UpdateFriend.dto'
import { MyHttpException } from '../utils/myHttpException'
import { User } from '../utils/typeorm/entities/User.entity'
import { StatusCode } from '../utils/typeorm/entities/StatusCode'
import { IFriendsService } from './interface/friend'

@Injectable()
export class FriendsService implements IFriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @Inject(Services.USERS) private userService: IUserService
  ) {}

  async query(user1: number, user2: number): Promise<Friend> {
    return await this.friendRepository
      .createQueryBuilder('friends')
      .where('friends.requesterId = :user1 AND  friends.receiverId = :user2', {
        user1,
        user2
      })
      .orWhere('friends.requesterId = :user2 AND  friends.receiverId = :user1', {
        user2,
        user1
      })
      .getOne()
  }

  async request(userId: number, friendDto: FriendDto): Promise<Friend> {
    const { id: friendId } = await this.userService.findOne({
      id: friendDto.friendId
    })
    const query = await this.query(userId, friendId)
    if (query) {
      return await this.friendRepository.save({
        ...query,
        requesterId: userId,
        receiverId: friendId,
        status: StatusCode.PENDING
      })
    }
    const newFriend = this.friendRepository.create({
      requesterId: userId,
      receiverId: friendId,
      status: StatusCode.PENDING
    })
    return await this.friendRepository.save(newFriend)
  }

  async response(userId: number, updateFriendDto: UpdateFriendDto): Promise<Friend> {
    const { id: friendId } = await this.userService.findOne({
      id: updateFriendDto.friendId
    })

    const query = await this.query(userId, friendId)
    if (query?.receiverId !== userId) {
      throw new MyHttpException(`Không có lời mời kết bạn từ người dùng ${friendId}`, HttpStatus.FORBIDDEN)
    }
    if (query?.status === StatusCode.ACCEPTED) {
      throw new MyHttpException('Đã được chập nhận', HttpStatus.FORBIDDEN)
    } else if (query?.status === StatusCode.DECLINED) {
      throw new MyHttpException('Bạn đã hủy lời mời kết bạn trước đó', HttpStatus.FORBIDDEN)
    }
    return this.friendRepository.save({
      ...query,
      status: updateFriendDto.status
    })
  }

  async list(userId: number): Promise<User[]> {
    const query = await this.friendRepository
      .createQueryBuilder('friend')
      .where('(friend.requesterId = :userId OR friend.receiverId = :userId)', {
        userId
      })
      .andWhere('friend.status = :status', { status: StatusCode.ACCEPTED })
      .getMany()
    return await Promise.all(
      query.map(async (friend) => {
        const friendId = friend.requesterId === userId ? friend.receiverId : friend.requesterId
        return await this.userService.findOne({ id: friendId })
      })
    )
  }

  async delete(userId: number, friendDto: FriendDto): Promise<void> {
    const { id: friendId } = await this.userService.findOne({
      id: friendDto.friendId
    })
    const query = await this.query(userId, friendId)
    if (query && query.status === StatusCode.ACCEPTED) {
      await this.friendRepository.delete(query)
    } else {
      throw new MyHttpException('Không phải bạn bè', HttpStatus.BAD_REQUEST)
    }
  }
}
