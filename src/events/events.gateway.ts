import { OnEvent } from '@nestjs/event-emitter'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
@WebSocketGateway({ namespace: 'events' })
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @OnEvent('place.create')
  handlePlaceCreateEvent(payload: any) {
    console.log('inside place create')

    this.server.emit('onCreate', payload)
  }
}
