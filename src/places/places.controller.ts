import { Body, Controller, Patch, Get, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { User } from '../users/utils/user.decorator'
import { CreatePlaceDto } from './dto/CreatePlace.dto'
import { IPlaceService } from './interface/place'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { MyHttpException } from '../utils/myHttpException'
import { FindPlace } from '../utils/types'
import { EditPlaceDto } from './dto/EditPlace.dto'

@Controller(Routes.PLACES)
@UseGuards(JwtAuthGuard)
export class PlacesController {
  constructor(@Inject(Services.PLACES) private readonly placesService: IPlaceService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPlace(@User('sub') userId: number, @Body() body: CreatePlaceDto) {
    return await this.placesService.createPlace(userId, body)
  }

  @Get()
  async getPlaces() {
    return await this.placesService.getPlaces()
  }

  @Get('/search')
  async searchPlace(@Query('q') q: string) {
    return await this.placesService.searchPlace(q)
  }
  @Get(':id')
  async findOnePlace(@Param('id') id: string) {
    const placeId = parseInt(id)
    if (isNaN(placeId)) {
      throw new MyHttpException('PlaceId must be a number', HttpStatus.BAD_REQUEST)
    }
    return await this.placesService.findOnePlace({ id: placeId })
  }

  @Patch(':id')
  async editPlace(@User('sub') userId: number, @Param('id') id: string, @Body() body: EditPlaceDto) {
    const placeId = parseInt(id)
    if (isNaN(placeId)) {
      throw new MyHttpException('PlaceId must be a number', HttpStatus.BAD_REQUEST)
    }
    const findPlace: FindPlace = { id: placeId, createdId: userId }
    return await this.placesService.editPlace(findPlace, body)
  }

  @Get('users/:id')
  async getPlacesByUserId(@Param('id') id: string) {
    const userId = parseInt(id)
    if (isNaN(userId)) {
      throw new MyHttpException('UserId must be a number', HttpStatus.BAD_REQUEST)
    }
    return await this.placesService.getPlacesByUserId(userId)
  }
}
