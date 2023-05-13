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
  sub: number //id
  email: string //email
}

export type UploadImageParams = {
  key: string
  file: Express.Multer.File
}
