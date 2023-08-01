import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Profile } from '../../utils/typeorm'
import { Repository } from 'typeorm'
import { MyHttpException } from '../../utils/myHttpException'
import { IProfile } from '../interfaces/profile'
import { UpdateProfileParams } from '../../utils/types'
import { IImageStorageService } from '../../image-storage/image.storage'
import { Services } from '../../utils/constranst'

@Injectable()
export class ProfileService implements IProfile {
  constructor(
    @Inject(Services.IMAGE_STORAGE) private readonly imageStorageService: IImageStorageService,
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>
  ) {}

  async update(updateProfileParams: UpdateProfileParams): Promise<Profile> {
    const findProfile = await this.profileRepository.findOne({ where: { id: updateProfileParams.id } })
    if (!findProfile) {
      throw new MyHttpException('profile not found', HttpStatus.BAD_REQUEST)
    }
    if (updateProfileParams.file) {
      if (findProfile.avatar) {
        await this.imageStorageService.delete(findProfile.avatar)
      }
      findProfile.avatar = await this.imageStorageService.upload(updateProfileParams.file)
    }
    if (updateProfileParams.about) {
      findProfile.about = updateProfileParams.about
    } else {
      findProfile.about = ''
    }
    return await this.profileRepository.save(findProfile)
  }
}
