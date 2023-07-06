import { Module } from '@nestjs/common'
import configuration from './utils/config/configuration'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { PlacesModule } from './places/places.module'
import { EventsModule } from './events/events.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { FriendsModule } from './friends/friends.module'
import { ImageStorageModule } from './image-storage/image-storage.module'
import { ReviewsModule } from './reviews/reviews.module'
import { FavouritesModule } from './favourites/favourites.module'
import { CommentsModule } from './comments/comments.module'
import { NewsfeedModule } from './newsfeed/newsfeed.module'
import { PlaceImagesModule } from './place-images/place-images.module'
import { NotificationModule } from './notification/notification.module'
import { LikesModule } from './likes/likes.module'

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('CONTAINER'),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    FriendsModule,
    PlacesModule,
    EventsModule,
    ImageStorageModule,
    ReviewsModule,
    FavouritesModule,
    CommentsModule,
    NewsfeedModule,
    PlaceImagesModule,
    NotificationModule,
    LikesModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
