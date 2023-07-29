import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { IFavourites } from './interface/favourites'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FavouriteType, UserPlaceIndex } from '../utils/types'
import { IUserService } from '../users/interfaces/user'
import { Services } from '../utils/constranst'
import { IPlacesService } from '../places/interface/places'
import { MyHttpException } from '../utils/myHttpException'
import { User, Favourite, Place } from '../utils/typeorm'

@Injectable()
export class FavouritesService implements IFavourites {
  constructor(
    @InjectRepository(Favourite) private readonly favouriteRepo: Repository<Favourite>,
    @Inject(Services.USERS) private readonly usersService: IUserService,
    @Inject(Services.PLACES) private readonly placesService: IPlacesService
  ) {}

  async getFavourite(userPlaceIndex: UserPlaceIndex): Promise<Favourite> {
    const { userId, placeId } = userPlaceIndex
    await this.usersService.getUser({ id: userId })
    await this.placesService.findOne({ id: placeId })
    const existingOne = await this.favouriteRepo.findOne({
      where: {
        userId,
        placeId
      }
    })
    if (!existingOne) {
      return await this.setFavourite({ placeId, userId, here: false, want: false })
    }
    return existingOne
  }

  async setFavourite(content: UserPlaceIndex & FavouriteType): Promise<Favourite> {
    const { userId, placeId, want, here } = content
    const existingFavourite = await this.favouriteRepo
      .createQueryBuilder('favourite')
      .where('favourite.userId = :userId', { userId })
      .andWhere('favourite.placeId = :placeId', { placeId })
      .getOne()
    if (!existingFavourite) {
      const newFavourite = this.favouriteRepo.create({
        userId,
        placeId,
        want,
        here
      })
      return await this.favouriteRepo.save(newFavourite)
    }
    const updatedFavourite = {
      ...existingFavourite,
      here: content.here !== undefined ? content.here : existingFavourite.here,
      want: content.want !== undefined ? content.want : existingFavourite.want
    }
    return await this.favouriteRepo.save(updatedFavourite)
  }

  async herePlaces(userId: number): Promise<Place[]> {
    const places = await this.favouriteRepo
      .createQueryBuilder('favourite')
      .where('favourite.userId = :userId', { userId })
      .andWhere('favourite.here = :boolean', {
        boolean: true
      })
      .leftJoinAndSelect('favourite.place', 'place')
      .leftJoinAndSelect('place.images', 'images')
      .getMany()
    if (!places.length) {
      throw new MyHttpException('no place been here', HttpStatus.BAD_REQUEST)
    }
    const promise = places.map((place) => {
      return place.place
    })
    return await Promise.all(promise)
  }

  async wantPlaces(userId: number): Promise<Place[]> {
    const places = await this.favouriteRepo
      .createQueryBuilder('favourite')
      .where('favourite.userId = :userId', { userId })
      .andWhere('favourite.want = :boolean', {
        boolean: true
      })
      .leftJoinAndSelect('favourite.place', 'place')
      .leftJoinAndSelect('place.images', 'images')
      .getMany()
    if (!places.length) {
      throw new MyHttpException('no place been want', HttpStatus.BAD_REQUEST)
    }
    const promise = places.map((place) => {
      return place.place
    })
    return await Promise.all(promise)
  }

  async hereUsers(placeId: number): Promise<User[]> {
    const favourites = await this.favouriteRepo
      .createQueryBuilder('favourite')
      .where('favourite.placeId = :placeId', { placeId })
      .andWhere('favourite.here = :boolean', {
        boolean: true
      })
      .leftJoinAndSelect('favourite.user', 'user')
      .select('favourite')
      .addSelect('user')
      .getMany()
    const promise = favourites.map((favourite) => {
      return favourite.user
    })
    return await Promise.all(promise)
  }

  async wantUsers(placeId: number): Promise<User[]> {
    const favourites = await this.favouriteRepo
      .createQueryBuilder('favourite')
      .where('favourite.placeId = :placeId', { placeId })
      .andWhere('favourite.want = :boolean', {
        boolean: true
      })
      .leftJoinAndSelect('favourite.user', 'user')
      .select('favourite')
      .addSelect('user')
      .getMany()
    const promise = favourites.map((favourite) => {
      return favourite.user
    })
    return await Promise.all(promise)
  }
}
