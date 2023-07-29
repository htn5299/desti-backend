import { UpdateProfileParams } from '../../utils/types'
import { Profile } from '../../utils/typeorm'

export interface IProfile {
  update(updateProfileParams: UpdateProfileParams): Promise<Profile>
}
