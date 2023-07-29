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
import { MessagesModule } from './messages/messages.module'
import { ConversationsModule } from './conversations/conversations.module'
import { CodeResetModule } from './code-reset/code-reset.module'
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer'
import { join } from 'path'
import { BullModule } from '@nestjs/bull'

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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD')
          }
        },
        defaults: {
          from: `"Desti" <${config.get('MAIL_FROM')}>`
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
          // username: config.get('REDIS_USERNAME'),
          password: config.get('REDIS_PASSWORD')
        }
      }),
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
    LikesModule,
    MessagesModule,
    ConversationsModule,
    CodeResetModule
  ],
  controllers: []
})
export class AppModule {}
