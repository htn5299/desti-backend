import { LikeType } from '../../utils/types'
import { LikeEntity } from '../../utils/typeorm/entities/Like.entity'

export interface ILikes {
  create(like: Pick<LikeType, 'userId' | 'reviewId'>): Promise<LikeEntity>

  delete(like: Pick<LikeType, 'id' | 'userId'>): Promise<LikeEntity>

  getOne(like: Partial<Omit<LikeType, 'createdAt'>>): Promise<LikeEntity>

  getMany(like: Partial<Pick<LikeType, 'userId' | 'reviewId'>>): Promise<LikeEntity[]>
}
