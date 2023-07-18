import { Module } from '@nestjs/common'
import { ConversationsController } from './conversations.controller'
import { ConversationsService } from './conversations.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Conversation, Message } from '../utils/typeorm'
import { Services } from '../utils/constranst'
import { UsersModule } from '../users/users.module'
import { FriendsModule } from '../friends/friends.module'
import { JwtModule } from '@nestjs/jwt'
import configuration from '../utils/config/configuration'

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    UsersModule,
    FriendsModule,
    JwtModule.register({
      global: true,
      secret: configuration().JWT_SECRET_KEY,
      signOptions: { expiresIn: configuration().JWT_EXPIRATION_TIME }
    })
  ],
  controllers: [ConversationsController],
  providers: [{ provide: Services.CONVERSATIONS, useClass: ConversationsService }],
  exports: [{ provide: Services.CONVERSATIONS, useClass: ConversationsService }]
})
export class ConversationsModule {}
