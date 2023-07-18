import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException
} from '@nestjs/common'
import { Observable } from 'rxjs'
import configuration from '../../utils/config/configuration'
import { JwtService } from '@nestjs/jwt'
import { Services } from '../../utils/constranst'
import { IConversationsService } from '../interfaces/conversations'
import { extractTokenFromHeader } from '../../utils/helpers'

@Injectable()
export class ConversationInterceptor implements NestInterceptor {
  constructor(
    private jwtService: JwtService,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    console.log('conversationInterceptor')
    const request = context.switchToHttp().getRequest()
    const token = extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    const payload = await this.jwtService.verifyAsync(token, {
      secret: configuration().JWT_SECRET_KEY
    })
    const conversationId = request.params.id
    const isAccess = await this.conversationsService.hasAccess({ userId: payload['sub'], id: conversationId })
    if (!isAccess) throw new ForbiddenException()
    return next.handle()
  }
}
