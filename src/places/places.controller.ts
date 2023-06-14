import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors
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
import { FilesInterceptor } from '@nestjs/platform-express'
import { IPlaceImagesService } from '../place-images/interface/place-images'

@Controller(Routes.PLACES)
@UseGuards(JwtAuthGuard)
export class PlacesController {
  constructor(
    @Inject(Services.PLACES) private readonly placesService: IPlacesService,
    @Inject(Services.REVIEWS) private readonly reviewsService: IReviewsService,
    @Inject(Services.PLACE_IMAGES) private readonly placeImgService: IPlaceImagesService
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @User('sub') userId: number,
    @Body() body: CreatePlaceDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/
        })
        .addMaxSizeValidator({ maxSize: 5242880 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    )
    files: Express.MulterS3.File[]
  ) {
    const place = await this.placesService.create(userId, body)
    await this.placeImgService.uploadFiles(files, place.id)
    return place
  }

  @Get()
  async getAll(@Query('page', ParseIntPipe) page: number) {
    if (page < 1) {
      throw new MyHttpException('Page must not under 1', HttpStatus.BAD_REQUEST)
    }
    return await this.placesService.getAll(page)
  }

  @Get('users/:id')
  async getByUserId(@Param('id') id: string) {
    const userId = parseInt(id)
    if (isNaN(userId)) {
      throw new MyHttpException('UserId must be a number', HttpStatus.BAD_REQUEST)
    }
    return await this.placesService.getByUserId(userId)
  }
  @Get('/search')
  async search(@Query('q') q: string) {
    return await this.placesService.search(q)
  }
  @Get('top/:id')
  async topPlace(@Param('id', ParseIntPipe) id: number) {
    const topPlaces = await this.reviewsService.topPlaces(id)
    return Promise.all(topPlaces.map(async (place) => await this.placesService.findOne({ id: place.placeId })))
  }

  @Get(':placeId')
  async findOne(@Param('placeId', ParseIntPipe) id: number) {
    return await this.placesService.findOne({ id })
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
  @Get(':placeId/images')
  async getImages(@Param('placeId', ParseIntPipe) placeId: number) {
    const images = await this.placeImgService.getImages(placeId)
    if (images.length === 0) {
      throw new MyHttpException('No Images', HttpStatus.BAD_REQUEST)
    }
    return images
  }
}
