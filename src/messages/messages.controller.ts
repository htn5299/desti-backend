import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { IMessageService } from './interfaces/message'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { SkipThrottle, Throttle } from '@nestjs/throttler'
import { User } from '../users/utils/user.decorator'
import { CreateMessageDto } from './dtos/CreateMessage.dto'
import { EmptyMessageException } from './exceptions/EmptyMessage'
import { IUserService } from '../users/interfaces/user'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { EditMessageDto } from './dtos/EditMessage.dto'
import { ConversationInterceptor } from '../conversations/interceptors/conversation.interceptor'

@Controller(Routes.MESSAGES)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ConversationInterceptor)
export class MessagesController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
    private eventEmitter: EventEmitter2
  ) {}

  @Throttle(5, 10)
  @Post()
  async createMessage(
    @User('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: CreateMessageDto
  ) {
    const { content } = body
    if (!content) throw new EmptyMessageException()
    const user = await this.userService.getUser({ id: userId })
    const params = { user, id, content }
    const response = await this.messageService.createMessage(params)
    this.eventEmitter.emit('message.create', response)
    return
  }

  @Get()
  @SkipThrottle()
  async getMessagesFromConversation(@Param('id', ParseIntPipe) id: number) {
    const messages = await this.messageService.getMessages(id)
    return { id, messages }
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @User('sub') userId: number,
    @Param('id', ParseIntPipe) conversationId: number,
    @Param('messageId', ParseIntPipe) messageId: number
  ) {
    const params = { userId, conversationId, messageId }
    await this.messageService.deleteMessage(params)
    this.eventEmitter.emit('message.delete', params)
    return { conversationId, messageId }
  }

  // api/conversations/:conversationId/messages/:messageId
  @Patch(':messageId')
  async editMessage(
    @User('sub') userId: number,
    @Param('id') conversationId: number,
    @Param('messageId') messageId: number,
    @Body() { content }: EditMessageDto
  ) {
    const params = { userId, content, conversationId, messageId }
    const message = await this.messageService.editMessage(params)
    this.eventEmitter.emit('message.update', message)
    return message
  }
}
