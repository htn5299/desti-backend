import { Module } from '@nestjs/common'
import { PlacesController } from './places.controller'
import { PlacesService } from './places.service'
import { Services } from '../utils/constranst'

@Module({
  controllers: [PlacesController],
  providers: [
    {
      provide: Services.PLACES,
      useClass: PlacesService
    }
  ]
})
export class PlacesModule {}
