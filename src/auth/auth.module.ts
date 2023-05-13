import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { Services } from '../utils/constranst'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy/jwt.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefreshToken } from '../utils/typeorm/entities/RefreshToken.entity'
import { RefreshTokenService } from './refreshToken.service'
@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    {
      provide: Services.AUTH,
      useClass: AuthService
    },
    {
      provide: Services.REFRESH_TOKEN,
      useClass: RefreshTokenService
    },
    JwtStrategy
  ]
})
export class AuthModule {}
