import { FavouriteType, UserPlaceIndex } from '../../utils/types'
import { Place, Favourite, User } from '../../utils/typeorm'

export interface IFavourites {
  getFavourite(userPlaceIndex: UserPlaceIndex): Promise<Favourite>

  setFavourite(content: FavouriteType & UserPlaceIndex): Promise<Favourite>

  herePlaces(userId: number): Promise<Place[]>

  wantPlaces(userId: number): Promise<Place[]>

  hereUsers(placeId: number): Promise<User[]>

  wantUsers(placeId: number): Promise<User[]>
}
