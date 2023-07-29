import { RefreshToken } from '../../utils/typeorm'

export interface IRefreshTokenService {
  findToken(refreshToken: string): Promise<RefreshToken>

  deleteToken(refreshToken: string): Promise<void>
}
