import { PlaceImage } from '../../utils/typeorm/entities/PlaceImage.entity'

export interface IPlaceImagesService {
  uploadFiles(files: Express.MulterS3.File[], placeId: number)
  getImages(placeId: number): Promise<PlaceImage[]>
}
