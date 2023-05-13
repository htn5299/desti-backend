import { Body, Controller, Patch, Get, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common'
import { Routes, Services } from '../utils/constranst'
import { User } from '../users/utils/user.decorator'
import { JwtAuthGuard } from '../auth/guard/jwt.guard'
import { MyHttpException } from '../utils/myHttpException'
import { CreateReview, FindPlace } from '../utils/types'
import { CreatePlaceDto } from './dto/CreatePlace.dto'
import { UpdatePlaceDto } from './dto/UpdatePlace.dto'
import { IPlacesService } from './interface/places'
import { IReviewsService } from '../reviews/interface/reviews'
import { CreateReviewDto } from '../reviews/dto/CreateReview.dto'

@Controller(Routes.PLACES)
@UseGuards(JwtAuthGuard)
export class PlacesController {
  constructor(
    @Inject(Services.PLACES) private readonly placesService: IPlacesService,
    @Inject(Services.REVIEWS) private readonly reviewsService: IReviewsService
  ) {}
  @Post()
  async create(@User('sub') userId: number, @Body() body: CreatePlaceDto) {
    return await this.placesService.create(userId, body)
  }

  @Get()
  async getAll() {
    return await this.placesService.getAll()
  }

  @Get('/search')
  async search(@Query('q') q: string) {
    return await this.placesService.search(q)
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const placeId = parseInt(id)
    if (isNaN(placeId)) {
      throw new MyHttpException('PlaceId must be a number', HttpStatus.BAD_REQUEST)
    }
    return await this.placesService.findOne({ id: placeId })
  }

  @Patch(':id')
  async update(@User('sub') userId: number, @Param('id') id: string, @Body() body: UpdatePlaceDto) {
    const placeId = parseInt(id)
    if (isNaN(placeId)) {
      throw new MyHttpException('PlaceId must be a number', HttpStatus.BAD_REQUEST)
    }
    const findPlace: FindPlace = { id: placeId, createdId: userId }
    return await this.placesService.update(findPlace, body)
  }
  @Get(':id/reviews')
  async getReviews(@Param('id') id: string) {
    return this.reviewsService.getAllbyPlace(parseInt(id))
  }
  @Post(':id/reviews')
  async createReview(@Param('id') placeId: number, @User('sub') userId: number, @Body() content: CreateReviewDto) {
    const createReview: CreateReview = { placeId, userId }
    return this.reviewsService.createReview(createReview, content)
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
