import { Place } from '../../utils/typeorm/entities/Place.entity'
import { FindPlace } from '../../utils/types'
import { CreatePlaceDto } from '../dto/CreatePlace.dto'
import { EditPlaceDto } from '../dto/EditPlace.dto'

export interface IPlaceService {
  createPlace(userId: number, body: CreatePlaceDto): Promise<Place>
  getPlaces(): Promise<Place[]>
  searchPlace(query: string): Promise<Place[]>
  findOnePlace(findPlace: FindPlace): Promise<Place>
  editPlace(findPlace: FindPlace, body: EditPlaceDto): Promise<Place>
  getPlacesByUserId(userId: number): Promise<Place[]>
}
