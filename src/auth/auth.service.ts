import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { IAuthService, TokenData } from './interfaces/auth'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { User } from '../utils/typeorm/entities/User.entity'
import { Payload, ValidateUserDetails } from '../utils/types'
import { compareHash } from '../utils/helpers'
import { JwtService } from '@nestjs/jwt'
import { RefreshToken } from '../utils/typeorm/entities/RefreshToken.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { MyHttpException } from '../utils/myHttpException'
import { ConfigService } from '@nestjs/config'
import { IRefreshTokenService } from './interfaces/refreshToken'
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly tokenRepository: Repository<RefreshToken>,
    @Inject(Services.USERS) private userService: IUserService,
    private jwtService: JwtService,
    private config: ConfigService,
    @Inject(Services.REFRESHTOKEN)
    private refreshTokenService: IRefreshTokenService
  ) {}
  async validateUser(userCredentials: ValidateUserDetails): Promise<User> {
    const user = await this.userService.findOne(
      { email: userCredentials.email },
      {
        selectAll: true
      }
    )
    if (!user) {
      throw new MyHttpException('Invalid Credentials', HttpStatus.NOT_FOUND)
    }
    const isMatch = await compareHash(userCredentials.password, user.password)
    return isMatch ? user : null
  }

  async generateAccessToken(payload: Payload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.config.get<string>('JWT_EXPIRATION_TIME')
    })
  }

  async generateRefreshToken(payload: Payload): Promise<string> {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET_KEY'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRATION_TIME')
    })

    const newToken = this.tokenRepository.create({
      userId: payload.sub,
      email: payload.email,
      token: refreshToken
    })
    await this.tokenRepository.save(newToken)
    return refreshToken
  }

  async signIn(userDetails: ValidateUserDetails): Promise<TokenData> {
    const user = await this.validateUser(userDetails)
    if (!user) {
      throw new MyHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    const payload: Payload = { sub: user.id, email: user.email }
    const accessToken = await this.generateAccessToken(payload)
    const refreshToken = await this.generateRefreshToken(payload)
    return {
      accessToken,
      refreshToken
    }
  }
  async signOut(refreshToken: string): Promise<TokenData> {
    await this.refreshTokenService.deleteToken(refreshToken)
    return {
      accessToken: null,
      refreshToken: null
    }
  }
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const existingToken = await this.refreshTokenService.findToken(refreshToken)
      const decoded = this.jwtService.verify(existingToken.token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET_KEY')
      })

      const payload: Payload = { sub: decoded.sub, email: decoded.email }
      const accessToken = await this.generateAccessToken(payload)
      return { accessToken }
    } catch (error) {
      throw new MyHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
  }
}
