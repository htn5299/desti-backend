import { User } from '../../utils/typeorm'
import { CreateUserDetails, FindUserParams, FindUserOptions } from '../../utils/types'

export interface IUserService {
  create(userDetails: CreateUserDetails): Promise<User>

  findOne(findUserParams: FindUserParams, option?: FindUserOptions): Promise<User>

  save(user: User): Promise<User>

  search(query: string): Promise<User[]>

  getUser(findUserParams: FindUserParams): Promise<User>
}
