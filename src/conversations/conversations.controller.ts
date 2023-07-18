import { Body, Controller, Get, Inject, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { IConversationsService } from './interfaces/conversations'
import { User } from '../users/utils/user.decorator'
import { CreateConversationDto } from './dtos/CreateConversation.dto'
import { IUserService } from '../users/interfaces/user'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { ConversationInterceptor } from './interceptors/conversation.interceptor'

@Controller(Routes.CONVERSATIONS)
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
    @Inject(Services.USERS)
    private readonly userService: IUserService
  ) {}
  @Post()
  async createConversation(@User('sub') userId: number, @Body() createConversationPayload: CreateConversationDto) {
    const user = await this.userService.findOne({ id: userId })
    const conversations = await this.conversationsService.createConversation(user, createConversationPayload)
    return conversations
  }

  @Get()
  async getConversations(@User('sub') userId: number) {
    return this.conversationsService.getConversations(userId)
  }
  @UseInterceptors(ConversationInterceptor)
  @Get(':id')
  async getConversationById(@Param('id') id: number) {
    return this.conversationsService.findById(id)
  }
}
