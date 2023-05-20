import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { MyHttpException } from '../../utils/myHttpException'
import { Socket } from 'socket.io'
@Injectable()
export class WsJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return false
    }
    const client: Socket = context.switchToWs().getClient()
    const { authorization } = client.handshake.headers
    return true
  }
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new MyHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    return user
  }
}
