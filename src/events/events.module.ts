import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { AuthModule } from '../auth/auth.module'
import { Services } from '../utils/constranst'
import { GatewaySessionManager } from './gateway.session'
import { FriendsModule } from '../friends/friends.module'
import { NotificationModule } from '../notification/notification.module'
@Module({
  imports: [AuthModule, FriendsModule, NotificationModule],
  providers: [
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager
    },
    EventsGateway
  ]
})
export class EventsModule {}
