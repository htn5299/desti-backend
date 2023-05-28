import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { User } from '../users/utils/user.decorator'
import { FavouriteDto } from './dto/favourite.dto'
import { IFavourites } from './interface/favourites'
import { FavouriteType, UserPlaceIndex } from '../utils/types'

@Controller(Routes.FAVOURITES)
@UseGuards(JwtAuthGuard)
export class FavouritesController {
  constructor(@Inject(Services.FAVOURITES) private readonly favouritesService: IFavourites) {}

  //Get one favourite with placeId and userId
  @Get()
  async getFavourite(@User('sub') userId: number, @Query('place', ParseIntPipe) placeId: number) {
    return await this.favouritesService.getFavourite({ userId, placeId })
  }

  //Update want or here
  @Post()
  async setFavourite(@User('sub') userId: number, @Body() body: FavouriteDto) {
    const content: UserPlaceIndex & FavouriteType = { userId, ...body }
    return await this.favouritesService.setFavourite(content)
  }

  @Get('users/:userId/here')
  async getHerePlacesByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.favouritesService.herePlaces(userId)
  }

  @Get('users/:userId/want')
  async getWantPlacesbyUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.favouritesService.wantPlaces(userId)
  }

  @Get('places/:placeId/here')
  async getHereUsersByPlaceId(@Param('placeId', ParseIntPipe) placeId: number) {
    return await this.favouritesService.hereUsers(placeId)
  }

  @Get('places/:placeId/want')
  async getWantUsersByPlaceId(@Param('placeId', ParseIntPipe) placeId: number) {
    return await this.favouritesService.wantUsers(placeId)
  }
}
