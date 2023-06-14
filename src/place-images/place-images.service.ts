import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PlaceImage } from '../utils/typeorm/entities/PlaceImage.entity'
import { Repository } from 'typeorm'
import { IImageStorageService } from '../image-storage/image.storage'
import { Services } from '../utils/constranst'
import { IPlaceImagesService } from './interface/place-images'

@Injectable()
export class PlaceImagesService implements IPlaceImagesService {
  constructor(
    @InjectRepository(PlaceImage) private readonly placeImgRepo: Repository<PlaceImage>,
    @Inject(Services.IMAGE_STORAGE) private readonly imageStorageService: IImageStorageService
  ) {}
  async uploadFiles(files: Express.MulterS3.File[], placeId: number) {
    const keys = await this.imageStorageService.uploads(files)
    keys.map(async (key) => {
      const placeImage = this.placeImgRepo.create({ key, placeId })
      return await this.placeImgRepo.save(placeImage)
    })
    return
  }
  async getImages(placeId: number): Promise<PlaceImage[]> {
    return await this.placeImgRepo
      .createQueryBuilder('placeimages')
      .where('placeimages.placeId = :placeId', { placeId })
      .getMany()
  }
}
