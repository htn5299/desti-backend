import { RefreshToken } from '../../utils/typeorm/entities/RefreshToken.entity'

export interface IRefreshTokenService {
  findToken(refreshToken: string): Promise<RefreshToken>
  deleteToken(refreshToken: string): Promise<void>
}
