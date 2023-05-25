import { Module } from '@nestjs/common'
import { FavouritesController } from './favourites.controller'
import { FavouritesService } from './favourites.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Favourite } from '../utils/typeorm/entities/Favourite.entity'
import { UsersModule } from '../users/users.module'
import { PlacesModule } from '../places/places.module'

@Module({
  imports: [TypeOrmModule.forFeature([Favourite]), UsersModule, PlacesModule],
  controllers: [FavouritesController],
  providers: [
    {
      provide: Services.FAVOURITES,
      useClass: FavouritesService
    }
  ]
})
export class FavouritesModule {}
