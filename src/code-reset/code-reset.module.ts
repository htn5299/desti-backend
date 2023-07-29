import { Module } from '@nestjs/common'
import { CodeResetService } from './code-reset.service'
import { Services } from '../utils/constranst'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CodeResetEntity } from '../utils/typeorm'
import { UsersModule } from '../users/users.module'
import { BullModule } from '@nestjs/bull'
import { EmailConsumer } from './consumers/email.consumer'

@Module({
  imports: [TypeOrmModule.forFeature([CodeResetEntity]), UsersModule, BullModule.registerQueue({ name: 'send-mail' })],
  providers: [{ provide: Services.CODE_RESET, useClass: CodeResetService }, EmailConsumer],
  exports: [{ provide: Services.CODE_RESET, useClass: CodeResetService }, EmailConsumer]
})
export class CodeResetModule {}
