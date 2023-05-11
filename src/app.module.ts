import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import configuration from './utils/config/configuration'
import { entities } from './utils/typeorm'
import { AuthModule } from './auth/auth.module'
import { PlacesModule } from './places/places.module'
import { EventsModule } from './events/events.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { FriendsModule } from './friends/friends.module'
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: parseInt(process.env.POSTGRES_DB_PORT),
      username: process.env.POSTGRES_DB_USERNAME,
      password: process.env.POSTGRES_DB_PASSWORD,
      synchronize: true,
      entities,
      logging: false
    }),
    UsersModule,
    AuthModule,
    FriendsModule,
    PlacesModule,
    EventsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
