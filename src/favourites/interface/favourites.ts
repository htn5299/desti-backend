import { Favourite } from '../../utils/typeorm/entities/Favourite.entity'
import { FavouriteType } from '../../utils/types'
import { Place } from '../../utils/typeorm/entities/Place.entity'

export interface IFavourites {
  favourite(favourite: FavouriteType): Promise<Favourite>
  here(userId: number): Promise<Place[]>
  want(userId: number): Promise<Place[]>
}
