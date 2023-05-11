import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Friend } from '../utils/typeorm/entities/Friend.entity'
import { Repository } from 'typeorm'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { FriendDto } from './dto/Friend.dto'
import { IFriendService } from './interface/friend'
import { UpdateFriendDto } from './dto/UpdateFriend.dto'
import { MyHttpException } from '../utils/myHttpException'
import { User } from '../utils/typeorm/entities/User.entity'
import { StatusCode } from '../utils/typeorm/entities/StatusCode'

@Injectable()
export class FriendService implements IFriendService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @Inject(Services.USERS) private userService: IUserService
  ) {}

  async queryFriend(user1: number, user2: number): Promise<Friend> {
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

  async requestFriend(userId: number, friendDto: FriendDto): Promise<Friend> {
    const { id: friendId } = await this.userService.find({
      id: friendDto.friendId
    })
    const queryFriend = await this.queryFriend(userId, friendId)
    if (queryFriend) {
      return await this.friendRepository.save({
        ...queryFriend,
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

  async responseFriend(userId: number, updateFriendDto: UpdateFriendDto): Promise<Friend> {
    const { id: friendId } = await this.userService.find({
      id: updateFriendDto.friendId
    })

    const queryFriend = await this.queryFriend(userId, friendId)
    if (queryFriend?.receiverId !== userId) {
      throw new MyHttpException(`Không có lời mời kết bạn từ người dùng ${friendId}`, HttpStatus.FORBIDDEN)
    }
    if (queryFriend?.status === StatusCode.ACCEPTED) {
      throw new MyHttpException('Đã được chập nhận', HttpStatus.FORBIDDEN)
    } else if (queryFriend?.status === StatusCode.DECLINED) {
      throw new MyHttpException('Bạn đã hủy lời mời kết bạn trước đó', HttpStatus.FORBIDDEN)
    }
    return this.friendRepository.save({
      ...queryFriend,
      status: updateFriendDto.status
    })
  }

  async listFriends(userId: number): Promise<User[]> {
    const queryFriend = await this.friendRepository
      .createQueryBuilder('friend')
      .where('(friend.requesterId = :userId OR friend.receiverId = :userId)', {
        userId
      })
      .andWhere('friend.status = :status', { status: StatusCode.ACCEPTED })
      .getMany()
    return await Promise.all(
      queryFriend.map(async (friend) => {
        const friendId = friend.requesterId === userId ? friend.receiverId : friend.requesterId
        return await this.userService.find({ id: friendId })
      })
    )
  }

  async deleteFriend(userId: number, friendDto: FriendDto): Promise<void> {
    const { id: friendId } = await this.userService.find({
      id: friendDto.friendId
    })
    const queryFriend = await this.queryFriend(userId, friendId)
    if (queryFriend && queryFriend.status === StatusCode.ACCEPTED) {
      await this.friendRepository.delete(queryFriend)
    } else {
      throw new MyHttpException('Không phải bạn bè', HttpStatus.BAD_REQUEST)
    }
  }
}
