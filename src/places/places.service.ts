import { Inject, Injectable, HttpStatus } from '@nestjs/common'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { InjectRepository } from '@nestjs/typeorm'
import { Place } from '../utils/typeorm/entities/Place.entity'
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
    const { name, description, latitude, longitude } = body
    const newPlace = this.placeRepository.create({ name, description, latitude, longitude, createdBy: user })
    const create = await this.placeRepository.save(newPlace)
    this.eventEmmiter.emit('place.create', create)
    return create
  }

  async getAll(): Promise<Place[]> {
    return await this.placeRepository.createQueryBuilder('place').leftJoinAndSelect('place.createdBy', 'user').getMany()
  }

  async findOne(findPlace: FindPlace): Promise<Place> {
    // const createdBy = await this.userService.findUser({ id: findPlace?.createdId })

    const place = await this.placeRepository.findOne({
      where: {
        id: findPlace.id
        // createdBy
      }
    })
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
      .limit(10)
      .getMany()
  }
}
