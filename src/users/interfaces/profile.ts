import { UpdateProfileParams } from '../../utils/types'
import { Profile } from '../../utils/typeorm/entities/Profile.entity'

export interface IProfile {
  update(updateProfileParams: UpdateProfileParams): Promise<Profile>
}
