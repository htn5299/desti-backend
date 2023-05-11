import { Friend } from '../../utils/typeorm/entities/Friend.entity'
import { UpdateFriendDto } from '../dto/UpdateFriend.dto'
import { FriendDto } from '../dto/Friend.dto'
import { User } from '../../utils/typeorm/entities/User.entity'
export interface IFriendsService {
  query(user1: number, user2: number): Promise<Friend>
  request(userId: number, friendDto: FriendDto): Promise<Friend>
  response(userId: number, updateFriendDto: UpdateFriendDto): Promise<Friend>
  list(userId: number): Promise<User[]>
  delete(userId: number, friendDto: FriendDto): Promise<void>
}
