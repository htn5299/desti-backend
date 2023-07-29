import { LikeType } from '../../utils/types'
import { LikeEntity } from '../../utils/typeorm'

export interface ILikes {
  setLike(like: Pick<LikeType, 'userId' | 'reviewId' | 'isLiked'>): Promise<LikeEntity>

  getOne(like: Partial<Omit<LikeType, 'createdAt'>>): Promise<LikeEntity>

  getMany(like: Partial<Pick<LikeType, 'userId' | 'reviewId'>>): Promise<LikeEntity[]>
}
