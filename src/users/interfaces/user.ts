import { User } from '../../utils/typeorm/entities/User.entity'
import { CreateUserDetails, FindUserParams, FindUserOptions } from '../../utils/types'
export interface IUserService {
  create(userDetails: CreateUserDetails): Promise<User>
  find(findUserParams: FindUserParams, option?: FindUserOptions): Promise<User>
  save(user: User): Promise<User>
  search(query: string): Promise<User[]>
  getById(id: number): Promise<User>
}
