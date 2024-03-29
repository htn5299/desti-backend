import { Module } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { Services } from '../utils/constranst'
import { UsersController } from './controllers/users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User, Profile } from '../utils/typeorm'
import { ProfileService } from './services/profile.service'
import { ImageStorageModule } from '../image-storage/image-storage.module'

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile]), ImageStorageModule],
  controllers: [UsersController],
  providers: [
    {
      provide: Services.USERS,
      useClass: UsersService
    },
    {
      provide: Services.PROFILE,
      useClass: ProfileService
    }
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UsersService
    },
    {
      provide: Services.PROFILE,
      useClass: ProfileService
    }
  ]
})
export class UsersModule {}
