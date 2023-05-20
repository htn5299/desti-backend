import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { User } from '../users/utils/user.decorator'
import { FavouriteDto } from './dto/favourite.dto'
import { IFavourites } from './interface/favourites'

@Controller(Routes.FAVOURITES)
export class FavouritesController {
  constructor(@Inject(Services.FAVOURITES) private readonly favouritesService: IFavourites) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async setFavourite(@User('sub') userId: number, @Body() content: FavouriteDto) {
    return await this.favouritesService.favourite({ userId, ...content })
  }
  @Get('here')
  @UseGuards(JwtAuthGuard)
  async getHere(@Query('user', ParseIntPipe) id: number) {
    return await this.favouritesService.here(id)
  }
  @Get('want')
  @UseGuards(JwtAuthGuard)
  async want(@Query('user', ParseIntPipe) id: number) {
    return await this.favouritesService.want(id)
  }
}
