import { Favourite } from '../../utils/typeorm/entities/Favourite.entity'
import { FavouriteType, UserPlaceIndex } from '../../utils/types'
import { Place } from '../../utils/typeorm/entities/Place.entity'
import { User } from '../../utils/typeorm/entities/User.entity'

export interface IFavourites {
  getFavourite(userPlaceIndex: UserPlaceIndex): Promise<Favourite>

  setFavourite(content: FavouriteType & UserPlaceIndex): Promise<Favourite>

  herePlaces(userId: number): Promise<Place[]>

  wantPlaces(userId: number): Promise<Place[]>

  hereUsers(placeId: number): Promise<User[]>

  wantUsers(placeId: number): Promise<User[]>
}
