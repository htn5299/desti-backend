import { Module } from '@nestjs/common'
import { PlacesController } from './places.controller'
import { PlacesService } from './places.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Place } from '../utils/typeorm/entities/Place.entity'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([Place]), UsersModule],
  controllers: [PlacesController],
  providers: [
    {
      provide: Services.PLACES,
      useClass: PlacesService
    }
  ]
})
export class PlacesModule {}