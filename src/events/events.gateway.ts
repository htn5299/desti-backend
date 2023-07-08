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
import { ServerEvents, Services } from '../utils/constranst'
import { IAuthService } from '../auth/interfaces/auth'
import { Inject, Logger } from '@nestjs/common'
import { AuthenticatedSocket } from '../utils/interfaces'
import { IGatewaySessionManager } from './gateway.session'
import { OnEvent } from '@nestjs/event-emitter'
import { Review } from '../utils/typeorm/entities/Review.entity'
import { INotification } from '../notification/interface/notification'
import { IFriendsService } from '../friends/interface/friend'
import { ConfigService } from '@nestjs/config'
import configuration from '../utils/config/configuration'

@WebSocketGateway({
  namespace: 'events',
  cors: {
    origin: configuration().CORS_ORIGIN.split(','),
    credentials: true
  },
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
    @Inject(Services.AUTH) private readonly authService: IAuthService,
    @Inject(Services.NOTIFICATION) private readonly notificationService: INotification,
    @Inject(Services.FRIENDS) private readonly friendsService: IFriendsService,
    private configService: ConfigService
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
      } catch (e) {
        socket.disconnect()
      }
    } else {
      socket.disconnect()
    }
  }

  handleDisconnect(@ConnectedSocket() socket: AuthenticatedSocket): any {
    this.sessions.removeUserSocket(socket.data?.user?.sub)
  }
  //server listen from react
  @SubscribeMessage('onPlaceJoin')
  onReviewJoin(@MessageBody() data: any, @ConnectedSocket() client: AuthenticatedSocket) {
    client.join(`place-${data.placeId}`)
    // client.to(`place-${data.placeId}`).emit('userJoin', { client: client.data.user.email })
  }

  @SubscribeMessage('onPlaceLeave')
  onReviewLeave(@MessageBody() data: any, @ConnectedSocket() client: AuthenticatedSocket) {
    client.leave(`place-${data.placeId}`)
    // client.to(`place-${data.placeId}`).emit('userLeave', { client: client.data.user.email })
  }
  //listen from controller
  @OnEvent(ServerEvents.REVIEW_CREATE)
  async handleReviewCreateEvent(payload: Review) {
    this.server.to(`place-${payload.place.id}`).emit('onReview', payload)
  }
  @OnEvent(ServerEvents.REVIEW_DELETE)
  async handleReviewDeleteEvent(payload: Review) {
    this.server.to(`place-${payload.place.id}`).emit('onDeleteReview', payload)
  }

  @OnEvent(ServerEvents.FRIEND_REVIEW)
  async handleFriendReviewCreate(payload: { notificationRecipientId: number; recipientId: number }) {
    const { recipientId, notificationRecipientId } = payload
    const receiverSocket = this.sessions.getUserSocket(recipientId)
    if (receiverSocket) {
      const newNotification = await this.notificationService.getNotificationRecipientById({ notificationRecipientId })
      receiverSocket.emit('onFriendReviewReceived', newNotification)
    }
  }
  @OnEvent(ServerEvents.FRIEND_REQUEST)
  async handleFriendRequest(payload: { notificationRecipientId: number; recipientId: number }) {
    const { recipientId, notificationRecipientId } = payload
    const receiverSocket = this.sessions.getUserSocket(recipientId)
    if (receiverSocket) {
      const newNotification = await this.notificationService.getNotificationRecipientById({ notificationRecipientId })
      receiverSocket.emit('onFriendRequest', newNotification)
    }
  }
  @OnEvent(ServerEvents.FRIEND_RESPONSE)
  async handleFriendResponse(payload: { notificationRecipientId: number; recipientId: number }) {
    const { recipientId, notificationRecipientId } = payload
    const receiverSocket = this.sessions.getUserSocket(recipientId)
    if (receiverSocket) {
      const newNotification = await this.notificationService.getNotificationRecipientById({ notificationRecipientId })
      receiverSocket.emit('onFriendResponse', newNotification)
    }
  }
}
