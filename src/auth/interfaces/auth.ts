import { User } from '../../utils/typeorm'
import { Payload, UserDetails, ValidateUserDetails } from '../../utils/types'

export interface TokenData {
  accessToken: string
  refreshToken: string
}

export interface IAuthService {
  validateGoogleUser(userDetails: UserDetails): Promise<User | null>

  validateUser(userDetails: ValidateUserDetails): Promise<User | null>

  generateAccessToken(payload: Payload): Promise<string>

  generateRefreshToken(payload: Payload): Promise<string>

  signIn(userDetails: ValidateUserDetails): Promise<TokenData>

  signOut(refreshToken: string): Promise<TokenData>

  refreshToken(refreshToken: string): Promise<{ accessToken: string }>

  handleVerifyToken(token: string): Promise<Payload>
}
