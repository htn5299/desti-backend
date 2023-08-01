import { Injectable, HttpStatus } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User, Profile } from '../../utils/typeorm'
import { CreateUserDetails, FindUserOptions, FindUserParams, UpdateUserParams } from '../../utils/types'
import { hashPassword } from '../../utils/helpers'
import { IUserService } from '../interfaces/user'
import { MyHttpException } from '../../utils/myHttpException'

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>
  ) {}

  async create(userDetails: CreateUserDetails) {
    const existingUser = await this.userRepository.findOneBy({
      email: userDetails.email
    })
    if (existingUser) {
      throw new MyHttpException('User already exists', HttpStatus.CONFLICT)
    }

    const profile = this.profileRepository.create()
    await this.profileRepository.save(profile)
    const password = await hashPassword(userDetails.password)
    const user = this.userRepository.create({ ...userDetails, password })
    user.profile = profile
    return await this.userRepository.save(user)
  }

  async findOne(findUserParams: FindUserParams, option?: FindUserOptions): Promise<User> {
    const selections: (keyof User)[] = ['id', 'email', 'name']
    const selectionswithPassword: (keyof User)[] = [...selections, 'password']
    const user = await this.userRepository.findOne({
      where: findUserParams,
      select: option?.selectAll ? selectionswithPassword : selections
    })
    if (!user) {
      throw new MyHttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return user
  }

  save(user: User): Promise<User> {
    return this.userRepository.save(user)
  }

  async search(query: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
    if (query.includes('@')) {
      const email = query.split('@')[0].split('.')[0]
      queryBuilder.where(`user.email ILIKE :email`, { email: `%${email}%` })
    } else {
      queryBuilder
        // .where(`user.email ILIKE :query`, { query: `%${query}%` })
        .where(`user.name ILIKE :query`, { query: `%${query}%` })
    }
    return (
      queryBuilder
        .leftJoinAndSelect('user.profile', 'profile')
        .limit(10)
        // .select(['user.name', 'user.email', 'user.id'])
        .getMany()
    )
  }

  async getUser(findUserParams: FindUserParams): Promise<User> {
    const { id, email } = findUserParams

    const queryBuilder = this.userRepository.createQueryBuilder('users').leftJoinAndSelect('users.profile', 'profile')

    if (id) {
      queryBuilder.where('users.id = :id', { id })
    } else if (email) {
      queryBuilder.where('users.email = :email', { email })
    }

    const user = await queryBuilder.getOne()
    if (!user) {
      throw new MyHttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return user
  }

  async update(updateUser: UpdateUserParams): Promise<User> {
    const findUser = await this.findOne({ id: updateUser.id })
    if (!updateUser.name) {
      return findUser
    }
    return this.userRepository.save({ ...findUser, name: updateUser.name })
  }
}
