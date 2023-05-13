import { forwardRef, Module } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { Services } from '../utils/constranst'
import { UsersController } from './controllers/users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../utils/typeorm/entities/User.entity'
import { Profile } from '../utils/typeorm/entities/Profile.entity'
import { ReviewsModule } from '../reviews/reviews.module'
@Module({
  imports: [TypeOrmModule.forFeature([User, Profile]), forwardRef(() => ReviewsModule)],
  controllers: [UsersController],
  providers: [
    {
      provide: Services.USERS,
      useClass: UsersService
    }
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UsersService
    }
  ]
})
export class UsersModule {}
