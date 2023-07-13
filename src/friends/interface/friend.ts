import { Friend } from '../../utils/typeorm/entities/Friend.entity'
import { UpdateFriendDto } from '../dto/UpdateFriend.dto'
import { User } from '../../utils/typeorm/entities/User.entity'
import { CheckedFriend, StatusCode } from '../../utils/constranst'
export interface IFriendsService {
  query(user1: number, user2: number): Promise<Friend>
  request(userId: number, friendId: number): Promise<Friend>
  response(userId: number, friendId: number, updateFriendDto: UpdateFriendDto): Promise<Friend>
  list(userId: number): Promise<User[]>
  getOne(id: number, userId: number): Promise<User>
  delete(userId: number, friendId: number): Promise<void>
  check(userId: number, friendId: number): Promise<Friend>
}
