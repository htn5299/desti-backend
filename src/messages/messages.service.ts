import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IMessageService } from './interfaces/message'
import { Conversation, Message } from '../utils/typeorm'
import { Repository } from 'typeorm'
import { Services } from '../utils/constranst'
import { IConversationsService } from '../conversations/interfaces/conversations'
import { IFriendsService } from '../friends/interface/friend'
import { CreateMessageParams, CreateMessageResponse, DeleteMessageParams, EditMessageParams } from '../utils/types'
import { ConversationNotFoundException } from '../conversations/exceptions/ConversationNotFound'
import { FriendNotFoundException } from '../friends/exceptions/FriendNotFound'
import { CannotCreateMessageException } from './exceptions/CannotCreateMessage'
import { instanceToPlain } from 'class-transformer'
import { CannotDeleteMessage } from './exceptions/CannotDeleteMessage'
import { buildFindMessageParams } from '../utils/builders'

@Injectable()
export class MessagesService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
    @Inject(Services.FRIENDS)
    private readonly friendsService: IFriendsService
  ) {}
  async createMessage(params: CreateMessageParams): Promise<CreateMessageResponse> {
    const { user, content, id } = params
    const conversation = await this.conversationService.findById(id)
    if (!conversation) throw new ConversationNotFoundException()
    const { creator, recipient } = conversation
    const isFriends = await this.friendsService.check(creator.id, recipient.id)
    if (!isFriends) throw new FriendNotFoundException()
    if (creator.id !== user.id && recipient.id !== user.id) throw new CannotCreateMessageException()
    const message = this.messageRepository.create({
      content,
      conversation,
      author: instanceToPlain(user)
    })
    const savedMessage = await this.messageRepository.save(message)
    conversation.lastMessageSent = savedMessage
    const updated = await this.conversationService.save(conversation)
    return { message: savedMessage, conversation: updated }
  }
  async getMessages(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['author', 'author.profile'],
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' }
    })
  }
  async deleteMessage(params: DeleteMessageParams) {
    const { conversationId } = params
    const msgParams = { id: conversationId, limit: 5 }
    const conversation = await this.conversationService.getMessages(msgParams)
    if (!conversation) throw new ConversationNotFoundException()
    const findMessageParams = buildFindMessageParams(params)
    const message = await this.messageRepository.findOne({ where: findMessageParams })
    if (!message) throw new CannotDeleteMessage()
    if (conversation.lastMessageSent.id !== message.id) return this.messageRepository.delete({ id: message.id })
    return this.deleteLastMessage(conversation, message)
  }
  async deleteLastMessage(conversation: Conversation, message: Message) {
    const size = conversation.messages.length
    const SECOND_MESSAGE_INDEX = 1
    if (size <= 1) {
      console.log('Last Message Sent is deleted')
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: null
      })
      return this.messageRepository.delete({ id: message.id })
    } else {
      console.log('There are more than 1 message')
      const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX]
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: newLastMessage
      })
      return this.messageRepository.delete({ id: message.id })
    }
  }
  async editMessage(params: EditMessageParams): Promise<Message> {
    const messageDB = await this.messageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId }
      },
      relations: ['conversation', 'conversation.creator', 'conversation.recipient', 'author', 'author.profile']
    })
    if (!messageDB) throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST)
    messageDB.content = params.content
    return this.messageRepository.save(messageDB)
  }
}
