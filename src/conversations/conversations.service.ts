import { Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Conversation, Message, User } from 'utils/typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { IFriendsService } from '../friends/interface/friend'
import { IConversationsService } from './interfaces/conversations'
import {
  AccessParams,
  CreateConversationParams,
  GetConversationMessagesParams,
  UpdateConversationParams
} from '../utils/types'
import { UserNotFoundException } from '../users/exceptions/UserNotFound'
import { CreateConversationException } from './exceptions/CreateConversation'
import { FriendNotFoundException } from '../friends/exceptions/FriendNotFound'
import { ConversationExistsException } from './exceptions/ConversationExists'
import { ConversationNotFoundException } from './exceptions/ConversationNotFound'

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
    @Inject(Services.FRIENDS)
    private readonly friendsService: IFriendsService
  ) {}
  async getConversations(id: number): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .leftJoinAndSelect('creator.profile', 'creatorProfile')
      .leftJoinAndSelect('recipient.profile', 'recipientProfile')
      .where('creator.id = :id', { id })
      .orWhere('recipient.id = :id', { id })
      .orderBy('conversation.lastMessageSentAt', 'DESC')
      .getMany()
  }
  async findById(id: number): Promise<Conversation | undefined> {
    return this.conversationRepository.findOne({
      where: { id },
      relations: ['creator', 'recipient', 'creator.profile', 'recipient.profile', 'lastMessageSent']
    })
  }
  async isCreated(userId: number, recipientId: number): Promise<Conversation | undefined> {
    return this.conversationRepository.findOne({
      where: [
        {
          creator: { id: userId },
          recipient: { id: recipientId }
        },
        {
          creator: { id: recipientId },
          recipient: { id: userId }
        }
      ]
    })
  }
  async createConversation(creator: User, params: CreateConversationParams): Promise<Conversation> {
    // const { email, message: content } = params
    const { email } = params
    const recipient = await this.userService.findOne({ email })
    if (!recipient) throw new UserNotFoundException()
    if (creator.id === recipient.id) throw new CreateConversationException('Cannot create Conversation with yourself')
    const isFriends = await this.friendsService.check(creator.id, recipient.id)
    if (!isFriends) throw new FriendNotFoundException()
    const exists = await this.isCreated(creator.id, recipient.id)
    if (exists) throw new ConversationExistsException()
    const newConversation = this.conversationRepository.create({
      creator,
      recipient
    })
    const conversation = await this.conversationRepository.save(newConversation)
    // const newMessage = this.messageRepository.create({
    //   content,
    //   conversation,
    //   author: creator
    // })
    // await this.messageRepository.save(newMessage)
    return conversation
  }
  async hasAccess({ id, userId }: AccessParams): Promise<boolean> {
    const conversation = await this.findById(id)
    if (!conversation) throw new ConversationNotFoundException()
    return conversation.creator.id === userId || conversation.recipient.id === userId
  }
  async save(conversation: Conversation): Promise<Conversation> {
    return this.conversationRepository.save(conversation)
  }
  async getMessages({ id, limit }: GetConversationMessagesParams): Promise<Conversation> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('id = :id', { id })
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.messages', 'message')
      .where('conversation.id = :id', { id })
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .getOne()
  }
  async update({ id, lastMessageSent }: UpdateConversationParams) {
    return this.conversationRepository.update(id, { lastMessageSent })
  }
}
