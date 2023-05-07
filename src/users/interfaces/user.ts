import { User } from '../../utils/typeorm/entities/User.entity'
import { CreateUserDetails, FindUserParams, FindUserOptions } from '../../utils/types'
export interface IUserService {
  createUser(userDetails: CreateUserDetails): Promise<User>
  findUser(findUserParams: FindUserParams, option?: FindUserOptions): Promise<User>
  saveUser(user: User): Promise<User>
  searchUsers(query: string): Promise<User[]>
}
