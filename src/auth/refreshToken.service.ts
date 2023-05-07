import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RefreshToken } from '../utils/typeorm/entities/RefreshToken.entity'
import { Repository } from 'typeorm'
import { MyHttpException } from '../utils/myHttpException'
import { IRefreshTokenService } from './interfaces/refreshToken'

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {}
  async findToken(refreshToken: string): Promise<RefreshToken> {
    const token = this.refreshTokenRepository.findOneBy({
      token: refreshToken
    })
    if (!token) {
      throw new MyHttpException('Refresh token not found in database', HttpStatus.NOT_FOUND)
    }
    return token
  }
  async deleteToken(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token: refreshToken })
  }
}
