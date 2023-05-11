import { Inject, Injectable, HttpStatus } from '@nestjs/common'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { InjectRepository } from '@nestjs/typeorm'
import { Place } from '../utils/typeorm/entities/Place.entity'
import { Repository } from 'typeorm'
import { CreatePlaceDto } from './dto/CreatePlace.dto'
import { IPlaceService } from './interface/place'
import { EditPlaceDto } from './dto/EditPlace.dto'
import { MyHttpException } from '../utils/myHttpException'
import { FindPlace } from '../utils/types'
import { EventEmitter2 } from '@nestjs/event-emitter'
@Injectable()
export class PlacesService implements IPlaceService {
  constructor(
    @Inject(Services.USERS) private userService: IUserService,
    @InjectRepository(Place) private readonly placeRepository: Repository<Place>,
    private readonly eventEmmiter: EventEmitter2
  ) {}
  async createPlace(userId: number, body: CreatePlaceDto): Promise<Place> {
    const user = await this.userService.find({ id: userId })
    const { name, description, latitude, longitude } = body
    const newPlace = this.placeRepository.create({ name, description, latitude, longitude, createdBy: user })
    const createPlace = await this.placeRepository.save(newPlace)
    this.eventEmmiter.emit('place.create', createPlace)
    return createPlace
  }

  async getPlaces(): Promise<Place[]> {
    const places = await this.placeRepository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.createdBy', 'user')
      .getMany()
    return places
  }

  async findOnePlace(findPlace: FindPlace): Promise<Place> {
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

  async editPlace(findPlace: FindPlace, body: EditPlaceDto): Promise<Place> {
    const place = await this.findOnePlace(findPlace)
    const updatePlace = { ...place, ...body }
    return await this.placeRepository.save(updatePlace)
  }

  async getPlacesByUserId(userId: number): Promise<Place[]> {
    const createdBy = await this.userService.find({ id: userId })
    const places = await this.placeRepository.find({ where: { createdBy } })
    return places
  }
  async searchPlace(query: string): Promise<Place[]> {
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
