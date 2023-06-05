import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { Services } from '../utils/constranst'
import { IAuthService } from '../auth/interfaces/auth'
import { Inject, Logger } from '@nestjs/common'
import { AuthenticatedSocket } from '../utils/interfaces'
import { IGatewaySessionManager } from './gateway.session'
import { OnEvent } from '@nestjs/event-emitter'
import { Review } from '../utils/typeorm/entities/Review.entity'

@WebSocketGateway({
  namespace: 'events',
  // cors: {
  //   origin: 'http://localhost:3000',
  //   credentials: true
  // },
  pingInterval: 10000,
  pingTimeout: 15000
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateWay')
  @WebSocketServer()
  server: Server

  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    readonly sessions: IGatewaySessionManager,
    @Inject(Services.AUTH) private readonly authService: IAuthService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterInit(): any {
    this.logger.log('Initialized')
  }

  async handleConnection(socket: AuthenticatedSocket): Promise<void> {
    const authHeader = socket.handshake.headers.authorization
    if (authHeader && (authHeader as string).split(' ')[1]) {
      try {
        socket.data.user = await this.authService.handleVerifyToken((authHeader as string).split(' ')[1])
        this.sessions.setUserSocket(socket.data.user.sub, socket)
        console.log(`connected: ${socket.id} - ${socket.data?.user?.email}`)
      } catch (e) {
        socket.disconnect()
      }
    } else {
      socket.disconnect()
    }
  }

  handleDisconnect(@ConnectedSocket() socket: AuthenticatedSocket): any {
    console.log(`disconnected: ${socket.id} - ${socket.data?.user?.email}`)
    this.sessions.removeUserSocket(socket.data?.user?.sub)
  }

  @SubscribeMessage('onPlaceJoin')
  onReviewJoin(@MessageBody() data: any, @ConnectedSocket() client: AuthenticatedSocket) {
    client.join(`place-${data.placeId}`)
    client.to(`place-${data.placeId}`).emit('userJoin', { client: client.data.user.email })
    console.log(`userJoin: ${client.data.user.email} | place-${data.placeId}`)
  }

  @SubscribeMessage('onPlaceLeave')
  onReviewLeave(@MessageBody() data: any, @ConnectedSocket() client: AuthenticatedSocket) {
    client.leave(`place-${data.placeId}`)
    client.to(`place-${data.placeId}`).emit('userLeave', { client: client.data.user.email })
    console.log(`userLeave: ${client.data.user.email} | place-${data.placeId}`)
  }

  @OnEvent('review.create')
  async handleMessageCreateEvent(payload: Review) {
    this.server.to(`place-${payload.place.id}`).emit('onReview', payload)
  }
}
