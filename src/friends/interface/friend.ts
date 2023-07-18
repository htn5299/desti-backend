import { UpdateFriendDto } from '../dto/UpdateFriend.dto'
import { User, Friend } from '../../utils/typeorm'
export interface IFriendsService {
  query(user1: number, user2: number): Promise<Friend>
  request(userId: number, friendId: number): Promise<Friend>
  response(userId: number, friendId: number, updateFriendDto: UpdateFriendDto): Promise<Friend>
  list(userId: number): Promise<User[]>
  getOne(id: number, userId: number): Promise<User>
  delete(userId: number, friendId: number): Promise<void>
  check(userId: number, friendId: number): Promise<Friend>
}
