import { Express } from 'express'
import { Action, Services } from './constranst'

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
