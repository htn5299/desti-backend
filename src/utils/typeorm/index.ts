import { Friend } from './entities/Friend.entity'
import { Place } from './entities/Place.entity'
import { Profile } from './entities/Profile.entity'
import { RefreshToken } from './entities/RefreshToken.entity'
import { Review } from './entities/Review.entity'
import { User } from './entities/User.entity'
import { Favourite } from './entities/Favourite.entity'
import { PlaceImage } from './entities/PlaceImage.entity'
import { NotificationEntity } from './entities/Notification.entity'
import { NotificationRecipientEntity } from './entities/NotificationRecipient.entity'
import { LikeEntity } from './entities/Like.entity'
import { CommentEntity } from './entities/Comment.entity'
import { Message } from './entities/Message.entity'
import { Conversation } from './entities/Conversation.entity'
import { CodeResetEntity } from './entities/CodeReset.entity'

const entities = [
  User,
  Profile,
  RefreshToken,
  Friend,
  Place,
  Review,
  Favourite,
  PlaceImage,
  NotificationEntity,
  NotificationRecipientEntity,
  LikeEntity,
  CommentEntity,
  Message,
  Conversation,
  CodeResetEntity
]
export default entities
export {
  User,
  Profile,
  RefreshToken,
  Friend,
  Place,
  Review,
  Favourite,
  PlaceImage,
  NotificationEntity,
  NotificationRecipientEntity,
  LikeEntity,
  CommentEntity,
  Message,
  Conversation,
  CodeResetEntity
}
