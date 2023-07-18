import { Express } from 'express'
import { Action, Services } from './constranst'
import { Conversation, Message, User } from './typeorm'

export type CreateUserDetails = {
  email: string
  name: string
  password: string
}

export type FindUserParams = Partial<{
  id: number
  email: string
}>
export type FindPlace = Partial<{
  id: number
  createdId: number
}>

export type FindUserOptions = Partial<{
  selectAll: boolean
}>
export type ValidateUserDetails = {
  email: string
  password: string
}
export type Payload = {
  sub: number
  email: string
}

export type UserPlaceIndex = {
  userId: number
  placeId: number
}
export type UpdateProfileParams = {
  id: number
  about?: string
  file?: Express.MulterS3.File
}
export type FavouriteType = {
  here?: boolean
  want?: boolean
}
export type NotificationType = {
  id: number
  actor: number
  entity: number
  action: Action
  service: Services
  createdAt: Date
  updatedAt: Date
}

export type NotificationRecipientType = {
  id: number
  recipient: number
  notification: number
  readAt: Date
  createdAt: Date
  updatedAt: Date
}

export type NotificationRecipientResponse = {
  id: number
  readAt: null | Date
  createdAt: Date
  updatedAt: Date
  notification: {
    id: number
    entity: number
    action: Action
    service: Services
    createdAt: Date
    updatedAt: Date
    actor: {
      id: number
      email: string
      name: string
    }
  }
}

export type LikeType = {
  id: number
  reviewId: number
  userId: number
  createdAt: Date
  isLiked: boolean
}
export type CommentType = {
  id: number
  reviewId: number
  userId: number
  comment: string
  createdAt: Date
}

export type AccessParams = {
  id: number
  userId: number
}
export type CreateConversationParams = {
  email: string
  // message: string
}
export type GetConversationMessagesParams = {
  id: number
  limit: number
}
export type UpdateConversationParams = Partial<{
  id: number
  lastMessageSent: Message
}>
export type CreateMessageParams = {
  id: number
  content?: string
  user: User
}

export type CreateMessageResponse = {
  message: Message
  conversation: Conversation
}

export type DeleteMessageParams = {
  userId: number
  conversationId: number
  messageId: number
}

export type FindMessageParams = {
  userId: number
  conversationId: number
  messageId: number
}

export type EditMessageParams = {
  conversationId: number
  messageId: number
  userId: number
  content: string
}

export type EditGroupMessageParams = {
  groupId: number
  messageId: number
  userId: number
  content: string
}
export interface AuthenticatedRequest extends Request {
  user: User
}
