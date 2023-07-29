import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ICodeReset } from './code-reset'
import { CodeResetEntity } from '../utils/typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { generateUUIDV4 } from '../utils/helpers'
import * as moment from 'moment'
import { MyHttpException } from '../utils/myHttpException'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class CodeResetService implements ICodeReset {
  constructor(
    @InjectRepository(CodeResetEntity)
    private codeResetEntityRepository: Repository<CodeResetEntity>,
    @Inject(Services.USERS) private userService: IUserService,
    @InjectQueue('send-mail') private sendMail: Queue
  ) {}

  async validateCode(code: string): Promise<CodeResetEntity> {
    const TEN_MINUTES_IN_MS = 10 * 60 * 1000
    const now = moment()
    const codeReset = await this.codeResetEntityRepository.findOne({ where: { code: code } })
    if (!codeReset) {
      throw new MyHttpException('No code', HttpStatus.BAD_REQUEST)
    }
    const timeDifference = now.diff(codeReset.updatedAt)
    if (timeDifference > TEN_MINUTES_IN_MS) {
      await this.deleteCode(codeReset.code)
      throw new MyHttpException('Code has expired', HttpStatus.BAD_REQUEST)
    }
    return codeReset
  }

  async generateCode(email: string): Promise<CodeResetEntity> {
    const generateCode = generateUUIDV4()
    const user = await this.userService.findOne({ email: email })
    await this.sendMail.add(
      'forget',
      {
        email: user.email,
        name: user.name,
        code: generateCode
      },
      { removeOnComplete: true }
    )
    const existing = await this.codeResetEntityRepository.findOne({ where: { email } })
    if (!existing) {
      const newCodeReset = await this.codeResetEntityRepository.create({ email: email, code: generateCode })
      return await this.codeResetEntityRepository.save(newCodeReset)
    }
    return await this.codeResetEntityRepository.save({ ...existing, code: generateCode })
  }

  async deleteCode(code: string): Promise<null> {
    await this.codeResetEntityRepository.delete({ code })
    return
  }
}
