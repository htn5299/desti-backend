import { Module } from '@nestjs/common'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Conversation, Message } from '../utils/typeorm'
import { ConversationsModule } from '../conversations/conversations.module'
import { FriendsModule } from '../friends/friends.module'
import { Services } from '../utils/constranst'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation]), ConversationsModule, FriendsModule, UsersModule],
  controllers: [MessagesController],
  providers: [
    {
      provide: Services.MESSAGES,
      useClass: MessagesService
    }
  ]
})
export class MessagesModule {}
