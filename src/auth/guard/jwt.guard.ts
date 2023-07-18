import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { MyHttpException } from '../../utils/myHttpException'
import configuration from '../../utils/config/configuration'
import { JwtService } from '@nestjs/jwt'
import { extractTokenFromHeader } from '../../utils/helpers'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super()
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: configuration().JWT_SECRET_KEY
      })
      request['user'] = payload
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new MyHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    return user
  }
}
