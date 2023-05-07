import { User } from '../../utils/typeorm/entities/User.entity'
import { Payload, ValidateUserDetails } from '../../utils/types'

export interface TokenData {
  accessToken: string
  refreshToken: string
}

export interface IAuthService {
  validateUser(userDetails: ValidateUserDetails): Promise<User | null>
  generateAccessToken(payload: Payload): Promise<string>
  generateRefreshToken(payload: Payload): Promise<string>
  signIn(userDetails: ValidateUserDetails): Promise<TokenData>
  signOut(refreshToken: string): Promise<TokenData>
  refreshToken(refreshToken: string): Promise<{ accessToken: string }>
}
