import { forwardRef, Module } from '@nestjs/common'
import { LikesService } from './likes.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LikeEntity } from '../utils/typeorm/entities/Like.entity'
import { ReviewsModule } from '../reviews/reviews.module'
import { UsersModule } from '../users/users.module'
import { LikesController } from './likes.controller'

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity]), forwardRef(() => UsersModule), forwardRef(() => ReviewsModule)],
  providers: [{ provide: Services.LIKES, useClass: LikesService }],
  controllers: [LikesController]
})
export class LikesModule {}
