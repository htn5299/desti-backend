import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { Services } from '../utils/constranst'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy/jwt.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefreshToken, User } from '../utils/typeorm'
import { RefreshTokenService } from './refreshToken.service'
import configuration from '../utils/config/configuration'
import { GoogleStrategy } from './strategy/google.strategy'
import { CodeResetModule } from '../code-reset/code-reset.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, User]),
    UsersModule,
    CodeResetModule,
    JwtModule.register({
      global: true,
      secret: configuration().JWT_SECRET_KEY,
      signOptions: { expiresIn: configuration().JWT_EXPIRATION_TIME }
    })
  ],
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
    JwtStrategy,
    GoogleStrategy
  ],
  exports: [
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
