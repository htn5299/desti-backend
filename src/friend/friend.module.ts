import { Module } from '@nestjs/common'
import { FriendController } from './friend.controller'
import { FriendService } from './friend.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Friend } from '../utils/typeorm/entities/Friend.entity'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), UsersModule],
  controllers: [FriendController],
  providers: [
    {
      provide: Services.FRIEND,
      useClass: FriendService
    }
  ]
})
export class FriendModule {}
