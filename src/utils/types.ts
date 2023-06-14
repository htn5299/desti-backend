import { Express } from 'express'

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

export type UploadImageParams = {
  key: string
  file: Express.MulterS3.File
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
export type UserReviewIndex = {
  reviewId: number
  userId: number
}
