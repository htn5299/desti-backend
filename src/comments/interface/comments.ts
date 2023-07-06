import { CommentEntity } from '../../utils/typeorm/entities/Comment.entity'
import { CommentType } from '../../utils/types'

export interface IComments {
  create(content: Omit<CommentType, 'id' | 'createdAt'>): Promise<CommentEntity>

  delete(comment: Pick<CommentType, 'id' | 'userId'>): Promise<CommentEntity>

  getOne(comment: Partial<Omit<CommentType, 'createdAt' | 'comment'>>): Promise<CommentEntity>

  getMany(comment: Partial<Pick<CommentType, 'userId' | 'reviewId'>>): Promise<CommentEntity[]>
}
