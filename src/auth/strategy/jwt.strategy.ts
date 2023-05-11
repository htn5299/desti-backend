import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Payload } from '../../utils/types'
import { IUserService } from '../../users/interfaces/user'
import { Services } from '../../utils/constranst'
import { MyHttpException } from '../../utils/myHttpException'
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, @Inject(Services.USERS) private userService: IUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY')
    })
  }

  async validate(payload: Payload): Promise<Payload> {
    const user = await this.userService.findOne({ id: payload.sub })
    if (!user) {
      throw new MyHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    return { sub: user.id, email: user.email }
  }
}
