import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { User } from '../users/utils/user.decorator'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { MyHttpException } from '../utils/myHttpException'
import { FindPlace } from '../utils/types'
import { CreatePlaceDto } from './dto/CreatePlace.dto'
import { UpdatePlaceDto } from './dto/UpdatePlace.dto'
import { IPlacesService } from './interface/places'
import { IReviewsService } from '../reviews/interface/reviews'

@Controller(Routes.PLACES)
@UseGuards(JwtAuthGuard)
export class PlacesController {
  constructor(
    @Inject(Services.PLACES) private readonly placesService: IPlacesService,
    @Inject(Services.REVIEWS) private reviewsService: IReviewsService
  ) {}

  @Post()
  async create(@User('sub') userId: number, @Body() body: CreatePlaceDto) {
    return await this.placesService.create(userId, body)
  }

  @Get()
  async getAll(@Query('page', ParseIntPipe) page: number) {
    if (page < 1) {
      throw new MyHttpException('Page must not under 1', HttpStatus.BAD_REQUEST)
    }
    return await this.placesService.getAll(page)
  }

  @Get('/search')
  async search(@Query('q') q: string) {
    return await this.placesService.search(q)
  }

  @Get(':placeId')
  async findOne(@Param('placeId', ParseIntPipe) id: number) {
    return await this.placesService.findOne({ id })
  }

  @Get(':placeId/reviews')
  async getReviews(@Param('placeId', ParseIntPipe) place: number) {
    return await this.reviewsService.getAll({ place })
  }

  @Patch(':placeId')
  async update(
    @User('sub') userId: number,
    @Param('placeId', ParseIntPipe) placeId: number,
    @Body() body: UpdatePlaceDto
  ) {
    const findPlace: FindPlace = { id: placeId, createdId: userId }
    return await this.placesService.update(findPlace, body)
  }

  @Get(':placeId/rating')
  async getRating(@Param('placeId', ParseIntPipe) placeId: number) {
    return this.placesService.getRating(placeId)
  }

  @Get('users/:id')
  async getByUserId(@Param('id') id: string) {
    const userId = parseInt(id)
    if (isNaN(userId)) {
      throw new MyHttpException('UserId must be a number', HttpStatus.BAD_REQUEST)
    }
    return await this.placesService.getByUserId(userId)
  }
}
