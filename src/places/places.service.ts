import { Inject, Injectable, HttpStatus } from '@nestjs/common'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { InjectRepository } from '@nestjs/typeorm'
import { Place } from '../utils/typeorm'
import { Repository } from 'typeorm'
import { MyHttpException } from '../utils/myHttpException'
import { FindPlace } from '../utils/types'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CreatePlaceDto } from './dto/CreatePlace.dto'
import { UpdatePlaceDto } from './dto/UpdatePlace.dto'
import { IPlacesService } from './interface/places'

@Injectable()
export class PlacesService implements IPlacesService {
  constructor(
    @Inject(Services.USERS) private userService: IUserService,
    @InjectRepository(Place) private readonly placeRepository: Repository<Place>,
    private readonly eventEmmiter: EventEmitter2
  ) {}

  async create(userId: number, body: CreatePlaceDto): Promise<Place> {
    const user = await this.userService.findOne({ id: userId })
    const newPlace = this.placeRepository.create({ ...body, createdBy: user })
    const create = await this.placeRepository.save(newPlace)
    this.eventEmmiter.emit('place.create', create)
    return create
  }

  async getAll(page: number): Promise<Place[]> {
    return await this.placeRepository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.createdBy', 'user')
      .leftJoinAndSelect('place.images', 'images')
      .take(3)
      .skip(3 * (page - 1))
      .getMany()
  }

  async findOne(findPlace: FindPlace): Promise<Place> {
    const place = await this.placeRepository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.createdBy', 'user')
      .leftJoinAndSelect('place.images', 'images')
      // .leftJoinAndSelect('place.reviews', 'review')
      .where('place.id = :id', { id: findPlace.id })
      .getOne()
    if (!place) {
      throw new MyHttpException('Place not found', HttpStatus.NOT_FOUND)
    }
    return place
  }

  async update(findPlace: FindPlace, body: UpdatePlaceDto): Promise<Place> {
    const place = await this.findOne(findPlace)
    const updatePlace = { ...place, ...body }
    return await this.placeRepository.save(updatePlace)
  }

  async getByUserId(userId: number): Promise<Place[]> {
    const createdBy = await this.userService.findOne({ id: userId })
    return await this.placeRepository.find({ where: { createdBy } })
  }

  async search(query: string): Promise<Place[]> {
    if (!query) {
      throw new MyHttpException('No have any query', HttpStatus.BAD_REQUEST)
    }
    const modifiedQuery = query.replace(/[\s-]+/g, '%')
    return await this.placeRepository
      .createQueryBuilder('place')
      .where(`unaccent(place.name) ILIKE unaccent(:query)`, { query: `%${modifiedQuery}%` })
      .orWhere(`unaccent(place.description) ILIKE unaccent(:query)`, { query: `%${modifiedQuery}%` })
      .leftJoinAndSelect('place.images', 'images')
      .limit(10)
      .getMany()
  }

  async getRating(placeId: number): Promise<{ rating: number }> {
    return await this.placeRepository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.reviews', 'review')
      .leftJoinAndSelect('place.images', 'images')
      .where('place.id = :id', { id: placeId })
      .select('ROUND(AVG(review.rating),1)', 'rating')
      .groupBy('place.id')
      .getRawOne()
  }
}
