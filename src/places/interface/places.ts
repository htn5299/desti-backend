import { Place } from '../../utils/typeorm/entities/Place.entity'
import { FindPlace } from '../../utils/types'
import { CreatePlaceDto } from '../dto/CreatePlace.dto'
import { UpdatePlaceDto } from '../dto/UpdatePlace.dto'
import { Review } from '../../utils/typeorm/entities/Review.entity'
export interface IPlacesService {
  create(userId: number, body: CreatePlaceDto): Promise<Place>
  getAll(page: number): Promise<Place[]>
  search(query: string): Promise<Place[]>
  findOne(findPlace: FindPlace): Promise<Place>
  update(findPlace: FindPlace, body: UpdatePlaceDto): Promise<Place>
  getByUserId(userId: number): Promise<Place[]>
  getRating(placeId: number): Promise<{ rating: number }>
}
