import { Module } from '@nestjs/common'
import { FavouritesController } from './favourites.controller'
import { FavouritesService } from './favourites.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Favourite } from '../utils/typeorm/entities/Favourite.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Favourite])],
  controllers: [FavouritesController],
  providers: [
    {
      provide: Services.FAVOURITES,
      useClass: FavouritesService
    }
  ]
})
export class FavouritesModule {}
