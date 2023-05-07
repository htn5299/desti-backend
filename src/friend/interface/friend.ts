import { Friend } from '../../utils/typeorm/entities/Friend.entity'
import { UpdateFriendDto } from '../dto/UpdateFriend.dto'
import { FriendDto } from '../dto/Friend.dto'
import { User } from '../../utils/typeorm/entities/User.entity'
export interface IFriendService {
  queryFriend(user1: number, user2: number): Promise<Friend>
  requestFriend(userId: number, friendDto: FriendDto): Promise<Friend>
  responseFriend(userId: number, updateFriendDto: UpdateFriendDto): Promise<Friend>
  listFriends(userId: number): Promise<User[]>
  deleteFriend(userId: number, friendDto: FriendDto): Promise<void>
}
