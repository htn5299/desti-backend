import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { AuthModule } from '../auth/auth.module'
import { Services } from '../utils/constranst'
import { GatewaySessionManager } from './gateway.session'

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager
    },
    EventsGateway
  ]
})
export class EventsModule {}
