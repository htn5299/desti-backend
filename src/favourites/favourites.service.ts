import { Injectable } from '@nestjs/common'
import { IFavourites } from './interface/favourites'
import { Favourite } from '../utils/typeorm/entities/Favourite.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FavouriteType } from '../utils/types'
import { Place } from '../utils/typeorm/entities/Place.entity'

@Injectable()
export class FavouritesService implements IFavourites {
  constructor(@InjectRepository(Favourite) private readonly favouriteRepo: Repository<Favourite>) {}
  async favourite(favourite: FavouriteType): Promise<Favourite> {
    const existingFavourite = await this.favouriteRepo
      .createQueryBuilder('favourite')
      .where('favourite.userId = :userId', { useId: favourite.userId })
      .where('favourite.placeId = :placeId', { placeId: favourite.placeId })
      .getOne()

    if (!existingFavourite) {
      const newFavourite = this.favouriteRepo.create({
        userId: favourite.userId,
        placeId: favourite.placeId,
        here: favourite.here,
        want: favourite.want
      })
      return await this.favouriteRepo.save(newFavourite)
    }
    const updatedFavourite = {
      ...existingFavourite,
      here: favourite.here !== undefined ? favourite.here : existingFavourite.here,
      want: favourite.want !== undefined ? favourite.want : existingFavourite.want
    }
    return await this.favouriteRepo.save(updatedFavourite)
  }
  async here(userId: number): Promise<Place[]> {
    const places = await this.favouriteRepo
      .createQueryBuilder('favourite')
      .where('favourite.userId = :userId', { userId })
      .where('favourite.here = :boolean', {
        boolean: true
      })
      .leftJoinAndSelect('favourite.place', 'place')
      .select('favourite')
      .addSelect('place')
      .getMany()
    const promise = places.map((place) => {
      return place.place
    })
    return await Promise.all(promise)
  }
  async want(userId: number): Promise<Place[]> {
    const places = await this.favouriteRepo
      .createQueryBuilder('favourite')
      .where('favourite.userId = :userId', { userId })
      .where('favourite.want = :boolean', {
        boolean: true
      })
      .leftJoinAndSelect('favourite.place', 'place')
      .select('favourite')
      .addSelect('place')
      .getMany()
    const promise = places.map((place) => {
      return place.place
    })
    return await Promise.all(promise)
  }
}
