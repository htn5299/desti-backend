import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Services } from '../../utils/constranst'
import { IAuthService } from '../interfaces/auth'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, @Inject(Services.AUTH) private authServide: IAuthService) {
    super({
      clientID: '579863121502-smkfcn1f80rsl32529ngftf5dg0bivhv.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/api/auth/google/redirect',
      scope: ['profile', 'email']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authServide.validateGoogleUser({
      email: profile.emails[0].value,
      name: profile.displayName
    })
    return { sub: user.id, email: user.email }
  }
}
