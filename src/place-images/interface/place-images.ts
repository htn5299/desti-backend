import { PlaceImage } from '../../utils/typeorm'

export interface IPlaceImagesService {
  uploadFiles(files: Express.MulterS3.File[], placeId: number)

  getImages(placeId: number): Promise<PlaceImage[]>
}
