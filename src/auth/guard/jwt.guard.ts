import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { MyHttpException } from '../../utils/myHttpException'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { Socket } from 'socket.io'
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context)
  }
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new MyHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    return user
  }
}
