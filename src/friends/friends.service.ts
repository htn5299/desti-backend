import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Friend } from '../utils/typeorm/entities/Friend.entity'
import { Repository } from 'typeorm'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
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
      .leftJoinAndSelect('friends.requester', 'user as requester')
      .leftJoinAndSelect('friends.receiver', 'user as receiver')
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

  async request(userId: number, friendId: number): Promise<Friend> {
    const requester = await this.userService.findOne({ id: userId })
    const receiver = await this.userService.findOne({ id: friendId })
    if (requester === receiver) {
      throw new MyHttpException('Can not request yourself', HttpStatus.BAD_REQUEST)
    }
    await this.userService.findOne({
      id: friendId
    })
    const query = await this.query(userId, friendId)
    if (query) {
      return await this.friendRepository.save({
        ...query,
        requester,
        receiver,
        status: StatusCode.PENDING
      })
    }
    const newFriend = this.friendRepository.create({
      requester,
      receiver,
      status: StatusCode.PENDING
    })
    return await this.friendRepository.save(newFriend)
  }

  async response(userId: number, friendId: number, updateFriendDto: UpdateFriendDto): Promise<Friend> {
    await this.userService.findOne({
      id: friendId
    })
    const user = await this.userService.findOne({ id: userId })
    const query = await this.query(userId, friendId)
    if (query?.receiver.id !== user.id) {
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
      .createQueryBuilder('friends')
      .leftJoinAndSelect('friends.requester', 'user as requester')
      .leftJoinAndSelect('friends.receiver', 'user as receiver')
      .where('(friends.requesterId = :userId OR friends.receiverId = :userId)', {
        userId
      })
      .andWhere('friends.status = :status', { status: StatusCode.ACCEPTED })
      .getMany()
    const user = await this.userService.findOne({ id: userId })
    return await Promise.all(
      query.map(async (friend) => {
        return friend.receiver.id === user.id ? friend.requester : friend.receiver
      })
    )
  }

  async delete(userId: number, friendId: number): Promise<void> {
    await this.friendRepository
      .createQueryBuilder('friend')
      .delete()
      .from(Friend)
      .where('requesterId = :userId  AND receiverId = :friendId', { userId, friendId })
      .orWhere('requesterId = :friendId AND receiverId = :userId', { friendId, userId })
      .execute()
  }
}
