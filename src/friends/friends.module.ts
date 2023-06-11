import { Module } from '@nestjs/common'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Friend } from '../utils/typeorm/entities/Friend.entity'
import { UsersModule } from '../users/users.module'
import { FriendsController } from './friends.controller'
import { FriendsService } from './friends.service'

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), UsersModule],
  controllers: [FriendsController],
  providers: [
    {
      provide: Services.FRIENDS,
      useClass: FriendsService
    }
  ],
  exports: [
    {
      provide: Services.FRIENDS,
      useClass: FriendsService
    }
  ]
})
export class FriendsModule {}
